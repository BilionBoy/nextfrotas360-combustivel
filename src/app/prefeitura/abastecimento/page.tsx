"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Fuel, Plus, CheckCircle, FileDown } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/ui/dialog";
import { useToast } from "@/src/components/ui/use-toast";
import { useRouter } from "next/navigation";

import { useRequisicoes } from "./hooks/useRequisicoes";
import { requisicoesApi } from "./api/requisicoes";
import RequisicaoForm from "./components/RequisicaoForm";
import { RequisicoesTable } from "./components/RequisicoesTable";

import type {
  CRequisicaoCombustivel,
  CreateRequisicaoDTO,
} from "@/src/@types/RequisicaoCombustivel";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";

export default function AbastecimentoPage() {
  const router = useRouter();
  const { toast } = useToast();

  const { requisicoes, loading, refetch } = useRequisicoes();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<CRequisicaoCombustivel | null>(null);

  // success modal data (QR + created requisicao)
  const [successOpen, setSuccessOpen] = useState(false);
  const [createdReq, setCreatedReq] = useState<CRequisicaoCombustivel | null>(
    null
  );
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  // ------------------------------------------------------
  // CREATE
  // ------------------------------------------------------
  async function handleCreate(payload: CreateRequisicaoDTO) {
    try {
      const created = await requisicoesApi.create(payload); // espera o created object
      // gerar QR (valor: voucher_codigo ou fallback REQ-<id>)
      const qrValue = created.voucher_codigo || `REQ-${created.id}`;
      const qrUrl = await QRCode.toDataURL(qrValue);

      setCreatedReq(created);
      setQrDataUrl(qrUrl);

      // abrir modal de sucesso automaticamente
      setSuccessOpen(true);
      setShowCreateModal(false);
      await refetch();

      toast({
        title: "Requisição criada!",
        description: "Voucher e QR Code gerados com sucesso.",
      });
    } catch (error) {
      console.error("[v0] erro create requisicao:", error);
      toast({
        title: "Erro ao criar requisição",
        description: "Não foi possível criar a requisição.",
        variant: "destructive",
      });
    }
  }

  // ------------------------------------------------------
  // EDIT SUBMIT
  // ------------------------------------------------------
  async function handleEditSubmit(payload: CreateRequisicaoDTO) {
    if (!editData) return;

    try {
      await requisicoesApi.update(editData.id, payload);
      toast({
        title: "Alterações salvas!",
        description: "A requisição foi atualizada com sucesso.",
      });
      setShowEditModal(false);
      setEditData(null);
      await refetch();
    } catch (err) {
      console.error("[v0] erro editar:", err);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar a requisição.",
        variant: "destructive",
      });
    }
  }

  // ------------------------------------------------------
  // DELETE
  // ------------------------------------------------------
  async function handleDelete(id: number) {
    try {
      await requisicoesApi.delete(id);
      toast({
        title: "Requisição removida",
        description: "A requisição foi excluída com sucesso.",
      });
      await refetch();
    } catch (err) {
      console.error("[v0] erro delete:", err);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a requisição.",
        variant: "destructive",
      });
    }
  }

  // ------------------------------------------------------
  // PDF download from createdReq + qrDataUrl
  // ------------------------------------------------------
  const handleGeneratePDF = () => {
    if (!createdReq) return;
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("VOUCHER DE ABASTECIMENTO", 105, 18, { align: "center" });
    doc.setFontSize(12);
    doc.text(
      `Código: ${createdReq.voucher_codigo || `REQ-${createdReq.id}`}`,
      20,
      36
    );
    doc.text(`Posto: ${createdReq.c_posto?.nome_fantasia || "-"}`, 20, 46);
    doc.text(`Veículo: ${createdReq.g_veiculo?.placa || "-"}`, 20, 56);
    doc.text(
      `Combustível: ${createdReq.c_tipo_combustivel?.descricao || "-"}`,
      20,
      66
    );
    doc.text(`Status: ${createdReq.voucher_status || "-"}`, 20, 76);
    doc.text(
      `Validade: ${
        createdReq.voucher_validade
          ? new Date(createdReq.voucher_validade).toLocaleString("pt-BR")
          : "-"
      }`,
      20,
      86
    );

    if (qrDataUrl) {
      // add qr image
      const imgProps = { format: "PNG" as const };
      doc.addImage(qrDataUrl, "PNG", 75, 100, 60, 60, undefined, "FAST");
    }

    doc.save(`voucher-${createdReq.voucher_codigo || createdReq.id}.pdf`);
  };

  // ------------------------------------------------------
  // VIEW
  // ------------------------------------------------------
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
            <Button variant="outline" onClick={() => router.back()}>
              Voltar
            </Button>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Requisições de Abastecimento
            </h1>
          </div>

          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-5 w-5" />
            Nova Requisição
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Requisições</CardTitle>
            <CardDescription>
              Visualize e gerencie suas requisições.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="text-center py-8">Carregando...</div>
            ) : (
              <RequisicoesTable
                requisicoes={requisicoes}
                onEdit={(r) => {
                  setEditData(r);
                  setShowEditModal(true);
                }}
                onDelete={handleDelete}
              />
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* CREATE MODAL */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Fuel className="h-6 w-6 text-primary" />
              Nova Requisição
            </DialogTitle>
            <DialogDescription>
              Preencha os dados da nova requisição.
            </DialogDescription>
          </DialogHeader>

          <RequisicaoForm onSave={handleCreate} />
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog
        open={showEditModal}
        onOpenChange={(open) => {
          if (!open) setEditData(null);
          setShowEditModal(open);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Fuel className="h-6 w-6 text-primary" />
              Editar Requisição
            </DialogTitle>
            <DialogDescription>
              Atualize os dados da requisição.
            </DialogDescription>
          </DialogHeader>

          {editData && (
            <RequisicaoForm initial={editData} onSave={handleEditSubmit} />
          )}
        </DialogContent>
      </Dialog>

      {/* SUCCESS MODAL (QR + PDF) */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
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

          {createdReq && (
            <div className="space-y-6 py-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Código do Voucher
                </p>
                <p className="text-3xl font-bold text-primary tracking-wider">
                  {createdReq.voucher_codigo || `REQ-${createdReq.id}`}
                </p>
              </div>

              {qrDataUrl && (
                <div className="flex justify-center">
                  <div className="p-4 bg-white rounded-lg">
                    <img src={qrDataUrl} alt="QR Code" className="w-48 h-48" />
                  </div>
                </div>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Veículo:</span>
                  <span className="font-medium">
                    {createdReq.g_veiculo?.placa || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Posto:</span>
                  <span className="font-medium">
                    {createdReq.c_posto?.nome_fantasia || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Combustível:</span>
                  <span className="font-medium">
                    {createdReq.c_tipo_combustivel?.descricao || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium capitalize">
                    {createdReq.voucher_status || "pendente"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSuccessOpen(false);
                  }}
                >
                  Fechar
                </Button>

                <Button
                  onClick={handleGeneratePDF}
                  className="flex items-center gap-2"
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
