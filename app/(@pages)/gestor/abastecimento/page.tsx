"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Fuel, Plus, CheckCircle, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { RequisicoesTable } from "./components/RequisicoesTable";
import { useRequisicoes } from "./hooks/useRequisicoes";
import { requisicoesApi } from "./api/requisicoes";
import { veiculosApi } from "./api/veiculos";
import { postosApi } from "./api/postos";
import { tiposCombustivelApi } from "./api/tiposCombustivel";
import type { GVeiculo } from "@/@types/Veiculo";
import type { CPosto } from "@/@types/Posto";
import type { CTipoCombustivel } from "@/@types/TipoCombustivel";
import type { CRequisicaoCombustivel } from "@/@types/RequisicaoCombustivel";

export default function NovoAbastecimento() {
  const { toast } = useToast();
  const router = useRouter();
  const { requisicoes, loading, refetch } = useRequisicoes();

  const [showForm, setShowForm] = useState(false);
  const [veiculos, setVeiculos] = useState<GVeiculo[]>([]);
  const [postos, setPostos] = useState<CPosto[]>([]);
  const [tiposCombustivel, setTiposCombustivel] = useState<CTipoCombustivel[]>(
    []
  );
  const [formDataLoading, setFormDataLoading] = useState(true);

  const [formData, setFormData] = useState({
    g_veiculo_id: "",
    c_posto_id: "",
    c_tipo_combustivel_id: "",
    km_atual: "",
    destino: "",
    quantidade_litros: "",
    completar_tanque: false,
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [requisicao, setRequisicao] = useState<CRequisicaoCombustivel | null>(
    null
  );
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    loadFormData();
  }, []);

  async function loadFormData() {
    setFormDataLoading(true);
    try {
      const [veiculosData, postosData, tiposData] = await Promise.all([
        veiculosApi.getAll().catch(() => []),
        postosApi.getAll().catch(() => []),
        tiposCombustivelApi.getAll().catch(() => []),
      ]);
      setVeiculos(veiculosData);
      setPostos(postosData);
      setTiposCombustivel(tiposData);
    } catch {
      toast({
        title: "Erro ao carregar dados",
        description: "Alguns dados podem não estar disponíveis.",
        variant: "destructive",
      });
    } finally {
      setFormDataLoading(false);
    }
  }

  const handleChange = (name: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const novaRequisicao = await requisicoesApi.create({
        g_veiculo_id: Number(formData.g_veiculo_id),
        c_posto_id: Number(formData.c_posto_id),
        c_tipo_combustivel_id: Number(formData.c_tipo_combustivel_id),
        km_atual: formData.km_atual ? Number(formData.km_atual) : undefined,
        destino: formData.destino || undefined,
        quantidade_litros: formData.quantidade_litros
          ? Number(formData.quantidade_litros)
          : undefined,
        completar_tanque: formData.completar_tanque,
      });

      const qrValue =
        novaRequisicao.voucher_codigo || `REQ-${novaRequisicao.id}`;
      const qrUrl = await QRCode.toDataURL(qrValue);

      setQrCodeUrl(qrUrl);
      setRequisicao(novaRequisicao);
      setIsSuccess(true);
      await refetch();

      toast({
        title: "Requisição Criada!",
        description: "Voucher e QR Code gerados com sucesso.",
      });
    } catch (error) {
      console.error("[v0] Error creating requisition:", error);
      toast({
        title: "Erro ao criar requisição",
        description: "Não foi possível criar a requisição.",
        variant: "destructive",
      });
    }
  };

  const handleGeneratePDF = () => {
    if (!requisicao) return;
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("VOUCHER DE ABASTECIMENTO", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Código: ${requisicao.voucher_codigo}`, 20, 40);
    doc.text(`Posto: ${requisicao.c_posto?.nome_fantasia || "-"}`, 20, 50);
    doc.text(`Veículo: ${requisicao.g_veiculo?.placa || "-"}`, 20, 60);
    doc.text(
      `Combustível: ${requisicao.c_tipo_combustivel?.descricao || "-"}`,
      20,
      70
    );
    doc.text(`Status: ${requisicao.voucher_status}`, 20, 80);
    doc.text(
      `Validade: ${
        requisicao.voucher_validade
          ? new Date(requisicao.voucher_validade).toLocaleString("pt-BR")
          : "-"
      }`,
      20,
      90
    );
    doc.save(`voucher-${requisicao.voucher_codigo || requisicao.id}.pdf`);
  };

  const handleNewRequest = () => {
    setIsSuccess(false);
    setRequisicao(null);
    setQrCodeUrl("");
    setFormData({
      g_veiculo_id: "",
      c_posto_id: "",
      c_tipo_combustivel_id: "",
      km_atual: "",
      destino: "",
      quantidade_litros: "",
      completar_tanque: false,
    });
    setShowForm(false);
  };

  const handleEdit = (req: CRequisicaoCombustivel) =>
    toast({
      title: "Em desenvolvimento",
      description: "Funcionalidade de edição será implementada em breve.",
    });

  const handleDelete = async (id: number) => {
    try {
      await requisicoesApi.delete(id);
      await refetch();
      toast({
        title: "Requisição excluída",
        description: "A requisição foi excluída com sucesso.",
      });
    } catch {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a requisição.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-background p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push("/gestor")}>
              Voltar
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Requisições de Abastecimento
            </h1>
          </div>
          <Button onClick={() => setShowForm(true)} disabled={formDataLoading}>
            <Plus className="mr-2 h-5 w-5" />
            Nova Requisição
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Requisições</CardTitle>
            <CardDescription>
              Visualize e gerencie suas requisições de abastecimento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Carregando...</div>
            ) : (
              <RequisicoesTable
                requisicoes={requisicoes}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Dialog de criação */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Fuel className="h-6 w-6 text-primary" />
              Nova Requisição de Abastecimento
            </DialogTitle>
            <DialogDescription>
              Preencha os dados para gerar uma nova requisição.
            </DialogDescription>
          </DialogHeader>

          {formDataLoading ? (
            <div className="text-center py-8">
              Carregando dados do formulário...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Veículo */}
                <div className="space-y-2">
                  <Label htmlFor="g_veiculo_id">Veículo</Label>
                  <Select
                    value={formData.g_veiculo_id}
                    onValueChange={(value) =>
                      handleChange("g_veiculo_id", value)
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o veículo" />
                    </SelectTrigger>
                    <SelectContent>
                      {veiculos.map((v) => (
                        <SelectItem key={v.id} value={v.id.toString()}>
                          {v.placa} - {v.marca} {v.modelo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Posto */}
                <div className="space-y-2">
                  <Label htmlFor="c_posto_id">Posto</Label>
                  <Select
                    value={formData.c_posto_id}
                    onValueChange={(value) => handleChange("c_posto_id", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o posto" />
                    </SelectTrigger>
                    <SelectContent>
                      {postos.map((p) => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.nome_fantasia}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tipo combustível */}
                <div className="space-y-2">
                  <Label htmlFor="c_tipo_combustivel_id">Combustível</Label>
                  <Select
                    value={formData.c_tipo_combustivel_id}
                    onValueChange={(value) =>
                      handleChange("c_tipo_combustivel_id", value)
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o combustível" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposCombustivel.map((t) => (
                        <SelectItem key={t.id} value={t.id.toString()}>
                          {t.descricao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* KM Atual */}
                <div className="space-y-2">
                  <Label htmlFor="km_atual">KM Atual</Label>
                  <Input
                    id="km_atual"
                    type="number"
                    value={formData.km_atual}
                    onChange={(e) => handleChange("km_atual", e.target.value)}
                    placeholder="0"
                  />
                </div>

                {/* Destino */}
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="destino">Destino</Label>
                  <Input
                    id="destino"
                    value={formData.destino}
                    onChange={(e) => handleChange("destino", e.target.value)}
                    placeholder="Ex: Centro da cidade"
                  />
                </div>

                {/* Litros / Completar */}
                <div className="space-y-2">
                  <Label htmlFor="quantidade_litros">Quantidade (Litros)</Label>
                  <Input
                    id="quantidade_litros"
                    type="number"
                    step="0.01"
                    value={formData.quantidade_litros}
                    onChange={(e) =>
                      handleChange("quantidade_litros", e.target.value)
                    }
                    placeholder="0.00"
                    disabled={formData.completar_tanque}
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.completar_tanque}
                      onChange={(e) =>
                        handleChange("completar_tanque", e.target.checked)
                      }
                      className="w-4 h-4"
                    />
                    <span>Completar Tanque</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Gerar Requisição
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de sucesso */}
      <Dialog open={isSuccess} onOpenChange={setIsSuccess}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl text-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              Requisição Gerada!
            </DialogTitle>
            <DialogDescription className="text-center">
              Apresente este QR Code no posto selecionado.
            </DialogDescription>
          </DialogHeader>

          {requisicao && (
            <div className="space-y-6 py-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Código do Voucher
                </p>
                <p className="text-3xl font-bold text-primary tracking-wider">
                  {requisicao.voucher_codigo || `REQ-${requisicao.id}`}
                </p>
              </div>

              {qrCodeUrl && (
                <div className="flex justify-center">
                  <div className="p-4 bg-white rounded-lg">
                    <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
                  </div>
                </div>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Veículo:</span>
                  <span className="font-medium">
                    {requisicao.g_veiculo?.placa || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Posto:</span>
                  <span className="font-medium">
                    {requisicao.c_posto?.nome_fantasia || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Combustível:</span>
                  <span className="font-medium">
                    {requisicao.c_tipo_combustivel?.descricao || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium capitalize">
                    {requisicao.voucher_status || "pendente"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={handleNewRequest}
                  className="flex-1"
                >
                  Nova Requisição
                </Button>
                <Button
                  onClick={handleGeneratePDF}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <FileDown className="w-4 h-4" /> Baixar PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
