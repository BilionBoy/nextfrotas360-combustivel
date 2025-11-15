"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  QrCode,
  ScanLine,
  CheckCircle,
  Fuel,
  Droplet,
  Milestone,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useToast } from "@/src/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/src/components/ui/dialog";
import { jsPDF } from "jspdf";
import { vouchersApi } from "./api/vouchers";
import type { CRequisicaoCombustivel } from "@/src/@types/RequisicaoCombustivel";

export default function ValidarRequisicao() {
  const { toast } = useToast();
  const router = useRouter();

  const [codigo, setCodigo] = useState("");
  const [isValidated, setIsValidated] = useState(false);
  const [validatedReq, setValidatedReq] =
    useState<CRequisicaoCombustivel | null>(null);

  // ----------------------------------------------------------------
  // 🧾 Gerar comprovante PDF após validação
  // ----------------------------------------------------------------
  const generatePDF = (req: CRequisicaoCombustivel) => {
    const doc = new jsPDF();
    const now = new Date();

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("NEXTFUEL360", doc.internal.pageSize.getWidth() / 2, 20, {
      align: "center",
    });

    doc.setFontSize(18);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Comprovante de Abastecimento",
      doc.internal.pageSize.getWidth() / 2,
      30,
      {
        align: "center",
      }
    );

    doc.line(20, 35, doc.internal.pageSize.getWidth() - 20, 35);

    doc.setFontSize(12);
    const startY = 50;
    const lineHeight = 10;

    doc.setFont("helvetica", "bold");
    doc.text("Código do Voucher:", 20, startY);
    doc.setFont("helvetica", "normal");
    doc.text(req.voucher_codigo || "-", 80, startY);

    doc.setFont("helvetica", "bold");
    doc.text("Data e Hora:", 20, startY + lineHeight);
    doc.setFont("helvetica", "normal");
    doc.text(now.toLocaleString("pt-BR"), 80, startY + lineHeight);

    doc.setFont("helvetica", "bold");
    doc.text("Veículo:", 20, startY + lineHeight * 2);
    doc.setFont("helvetica", "normal");
    doc.text(req.g_veiculo?.placa || "-", 80, startY + lineHeight * 2);

    doc.setFont("helvetica", "bold");
    doc.text("Posto:", 20, startY + lineHeight * 3);
    doc.setFont("helvetica", "normal");
    doc.text(req.c_posto?.nome_fantasia || "-", 80, startY + lineHeight * 3);

    doc.setFont("helvetica", "bold");
    doc.text("Combustível:", 20, startY + lineHeight * 4);
    doc.setFont("helvetica", "normal");
    doc.text(
      req.c_tipo_combustivel?.descricao || "-",
      80,
      startY + lineHeight * 4
    );

    doc.setFont("helvetica", "bold");
    doc.text("Status:", 20, startY + lineHeight * 5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(34, 139, 34);
    doc.text("VALIDADO E CONCLUÍDO", 80, startY + lineHeight * 5);
    doc.setTextColor(0, 0, 0);

    doc.line(
      20,
      doc.internal.pageSize.getHeight() - 40,
      doc.internal.pageSize.getWidth() - 20,
      doc.internal.pageSize.getHeight() - 40
    );
    doc.setFontSize(10);
    doc.text(
      "Assinatura do Frentista",
      doc.internal.pageSize.getWidth() / 4,
      doc.internal.pageSize.getHeight() - 30,
      { align: "center" }
    );
    doc.text(
      "Assinatura do Motorista",
      (doc.internal.pageSize.getWidth() / 4) * 3,
      doc.internal.pageSize.getHeight() - 30,
      { align: "center" }
    );

    doc.save(`comprovante-${req.voucher_codigo || "voucher"}.pdf`);
  };

  // ----------------------------------------------------------------
  // 🔍 Validação do voucher via API Rails
  // ----------------------------------------------------------------
  const handleValidation = async () => {
    if (!codigo.trim()) {
      toast({
        title: "Código obrigatório",
        description: "Digite o código do voucher para validar.",
        variant: "destructive",
      });
      return;
    }

    try {
      const requisicao = await vouchersApi.validate(codigo);
      setValidatedReq(requisicao);
      setIsValidated(true);

      toast({
        title: "Voucher válido!",
        description: "Abastecimento autorizado com sucesso.",
      });
    } catch (error: any) {
      console.error("Erro na validação do voucher:", error);
      toast({
        title: "Falha na validação",
        description: error.message || "Não foi possível validar o voucher.",
        variant: "destructive",
      });
    }
  };

  // ----------------------------------------------------------------
  // ✅ Confirmar e gerar comprovante
  // ----------------------------------------------------------------
  const confirmAndFinalize = () => {
    if (!validatedReq) return;

    toast({
      title: "Requisição concluída!",
      description: "O download do comprovante começará em instantes.",
    });

    generatePDF(validatedReq);
    setIsValidated(false);
    setValidatedReq(null);
    setCodigo("");
  };

  const handleScan = () => {
    toast({
      title: "Leitor de QR Code",
      description:
        "Funcionalidade de câmera não implementada. Por favor, insira o código manualmente.",
    });
  };

  // ----------------------------------------------------------------
  // 🖼️ Renderização
  // ----------------------------------------------------------------
  return (
    <div className="min-h-screen w-full bg-background p-4 md:p-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="absolute top-4 left-4">
          <Button variant="outline" onClick={() => router.push("/empresas")}>
            Voltar
          </Button>
        </div>

        <div className="bg-card border border-border rounded-lg shadow-xl p-6 md:p-10 text-center">
          <QrCode className="h-20 w-20 text-primary mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Validar Voucher
          </h1>
          <p className="text-muted-foreground mb-8">
            Insira o código numérico ou escaneie o QR Code para autorizar o
            abastecimento.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            <Input
              placeholder="Insira o código aqui... (ex: A7F9-29QK-4C1M)"
              className="text-center sm:text-left h-12 text-lg flex-grow"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
            />
            <Button onClick={handleValidation} className="h-12 text-lg">
              <CheckCircle className="mr-2 h-5 w-5" /> Validar
            </Button>
          </div>

          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink mx-4 text-muted-foreground">OU</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <Button
            variant="secondary"
            onClick={handleScan}
            className="w-full h-16 text-lg"
          >
            <ScanLine className="mr-3 h-7 w-7" /> Escanear QR Code
          </Button>
        </div>
      </motion.div>

      <Dialog open={isValidated} onOpenChange={() => setIsValidated(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <CheckCircle className="h-8 w-8 text-green-500" />
              Voucher Validado!
            </DialogTitle>
            <DialogDescription>
              Confira os detalhes e confirme o abastecimento.
            </DialogDescription>
          </DialogHeader>

          {validatedReq && (
            <div className="my-4 space-y-4">
              <div className="flex justify-between items-center bg-muted/50 p-3 rounded-lg">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Fuel /> Combustível
                </span>
                <span className="font-bold text-lg">
                  {validatedReq.c_tipo_combustivel?.descricao}
                </span>
              </div>

              <div className="flex justify-between items-center bg-muted/50 p-3 rounded-lg">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Milestone /> Status
                </span>
                <span className="font-bold text-lg text-green-600 capitalize">
                  {validatedReq.voucher_status}
                </span>
              </div>

              {validatedReq.valor_total_formatado && (
                <div className="flex justify-between items-center bg-primary/10 p-4 rounded-lg border border-primary/50">
                  <span className="text-md font-bold text-primary flex items-center gap-2">
                    <Droplet /> Valor total
                  </span>
                  <span className="font-extrabold text-2xl text-primary">
                    {validatedReq.valor_total_formatado}
                  </span>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsValidated(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmAndFinalize}>Confirmar e Gerar PDF</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
