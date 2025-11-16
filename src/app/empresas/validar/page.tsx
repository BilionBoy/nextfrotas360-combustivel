"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  QrCode,
  ScanLine,
  CheckCircle,
  Fuel,
  Droplet,
  Milestone,
  Car,
  MapPin,
  Tag,
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

import { vouchersApi } from "./api/vouchers";
import type { CRequisicaoCombustivel } from "@/src/@types/RequisicaoCombustivel";

export default function ValidarRequisicao() {
  const { toast } = useToast();
  const router = useRouter();

  const [codigo, setCodigo] = useState("");
  const [step, setStep] = useState<"search" | "fill" | "final">("search");

  const [req, setReq] = useState<CRequisicaoCombustivel | null>(null);

  const [litros, setLitros] = useState("");
  const [total, setTotal] = useState("");

  // ============================================================
  // PREÇO POR LITRO (instantâneo)
  // ============================================================
  const preco_por_litro = useMemo(() => {
    const l = Number(litros);
    const t = Number(total);
    if (l <= 0 || t <= 0) return 0;
    return t / l;
  }, [litros, total]);

  // ============================================================
  // STEP 1 — Buscar voucher
  // ============================================================
  const buscarVoucher = async () => {
    if (!codigo.trim()) {
      return toast({
        title: "Código obrigatório",
        description: "Digite o código do voucher.",
        variant: "destructive",
      });
    }

    try {
      const data = await vouchersApi.find(codigo);
      setReq(data);
      setStep("fill");

      toast({
        title: "Voucher encontrado!",
        description: "Preencha os dados do abastecimento.",
      });
    } catch (err: any) {
      toast({
        title: "Erro",
        description: err.message || "Voucher não encontrado.",
        variant: "destructive",
      });
    }
  };

  // ============================================================
  // STEP 2 — Validar com litros + total
  // ============================================================
  const validar = async () => {
    if (!litros || !total || Number(litros) <= 0 || Number(total) <= 0) {
      return toast({
        title: "Dados inválidos",
        description: "Preencha litros e total corretamente.",
        variant: "destructive",
      });
    }

    if (!req) return;

    try {
      const updated = await vouchersApi.validate(
        req.id,
        Number(litros),
        Number(total)
      );

      setReq(updated);
      setStep("final");

      toast({
        title: "Abastecimento validado!",
        description: "Requisição concluída com sucesso.",
      });
    } catch (err: any) {
      toast({
        title: "Erro ao validar",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  // ============================================================
  // STEP 3 — Final
  // ============================================================
  const concluir = () => {
    setStep("search");
    setCodigo("");
    setLitros("");
    setTotal("");
    setReq(null);
  };

  return (
    <div className="min-h-screen w-full bg-background p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl"
      >
        <Button variant="outline" onClick={() => router.push("/empresas")}>
          Voltar
        </Button>

        <div className="bg-card border border-border rounded-xl shadow-lg p-8 mt-6 text-center">
          <QrCode className="h-16 w-16 text-primary mx-auto mb-4" />

          <h1 className="text-3xl font-bold mb-2">Validação de Voucher</h1>
          <p className="text-muted-foreground mb-6">
            Insira o código ou escaneie o QR Code.
          </p>

          {/* STEP 1 — Buscar voucher */}
          {step === "search" && (
            <>
              <Input
                placeholder="Ex: A7F9-29QK-4C1M"
                value={codigo}
                className="text-lg text-center h-12"
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              />

              <Button
                className="w-full mt-4 h-12 text-lg"
                onClick={buscarVoucher}
              >
                Validar Código
              </Button>

              <Button
                variant="secondary"
                className="w-full mt-3 h-12"
                onClick={() =>
                  toast({
                    title: "QR Code",
                    description:
                      "Leitor não implementado. Use o código manualmente.",
                  })
                }
              >
                <ScanLine className="mr-2" /> Escanear QR Code
              </Button>
            </>
          )}

          {/* STEP 2 — Preencher litros e total */}
          {step === "fill" && req && (
            <Dialog open={true}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-xl flex items-center gap-2">
                    <Fuel /> Dados do Abastecimento
                  </DialogTitle>
                  <DialogDescription>
                    Voucher encontrado. Preencha as informações abaixo.
                  </DialogDescription>
                </DialogHeader>

                {/* CARD DO VOUCHER */}
                <div className="bg-muted/40 border border-border rounded-lg p-4 mt-3 mb-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Tag size={14} /> Voucher
                    </span>
                    <span className="font-bold">{req.voucher_codigo}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Car size={14} /> Veículo
                    </span>
                    <span className="font-medium">
                      {req.g_veiculo?.placa || "-"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin size={14} /> Posto
                    </span>
                    <span className="font-medium">
                      {req.c_posto?.nome_fantasia || "-"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Droplet size={14} /> Combustível
                    </span>
                    <span className="font-medium">
                      {req.c_tipo_combustivel?.descricao}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Litros abastecidos
                    </span>
                    <Input
                      type="number"
                      value={litros}
                      onChange={(e) => setLitros(e.target.value)}
                      placeholder="Ex: 23.5"
                    />
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">
                      Valor total (R$)
                    </span>
                    <Input
                      type="number"
                      value={total}
                      onChange={(e) => setTotal(e.target.value)}
                      placeholder="Ex: 140.00"
                    />
                  </div>

                  {/* PREÇO POR LITRO */}
                  <div className="bg-primary/10 p-3 rounded-lg border border-primary/40 text-center">
                    <span className="text-sm text-muted-foreground">
                      Preço por litro
                    </span>
                    <p className="text-2xl font-bold text-primary mt-1">
                      R$ {preco_por_litro.toFixed(2)}
                    </p>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setStep("search")}>
                    Cancelar
                  </Button>
                  <Button onClick={validar}>Validar Abastecimento</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* STEP 3 — Final */}
          {step === "final" && req && (
            <Dialog open={true}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl">
                    <CheckCircle className="text-green-600" /> Voucher Validado!
                  </DialogTitle>
                  <DialogDescription>
                    Abastecimento concluído com sucesso.
                  </DialogDescription>
                </DialogHeader>

                <div className="bg-primary/10 p-4 rounded-lg mt-4 space-y-2 border border-primary/30">
                  <p className="font-semibold">
                    Litros: {req.quantidade_litros_formatado}
                  </p>
                  <p className="font-semibold">
                    Total: {req.valor_total_formatado}
                  </p>
                  <p className="font-semibold">
                    Preço/Litro: R${" "}
                    {(Number(req.preco_unitario) || 0).toFixed(2)}
                  </p>
                </div>

                <DialogFooter>
                  <Button onClick={concluir}>Concluir</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </motion.div>
    </div>
  );
}
