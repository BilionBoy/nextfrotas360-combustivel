"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Fuel, Plus } from "lucide-react";

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

import type { CRequisicaoCombustivel } from "@/src/@types/RequisicaoCombustivel";

import { RequisicoesTable } from "./components/RequisicoesTable";
import RequisicaoForm from "./components/RequisicaoForm";

export default function AbastecimentoPage() {
  const router = useRouter();
  const { toast } = useToast();

  const { requisicoes, loading, refetch } = useRequisicoes();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<CRequisicaoCombustivel | null>(null);

  // ------------------------------------------------------
  // CREATE
  // ------------------------------------------------------
  async function handleCreate(data: any) {
    try {
      await requisicoesApi.create(data);

      toast({
        title: "Requisição criada!",
        description: "A requisição foi registrada com sucesso.",
      });

      setShowCreateModal(false);
      await refetch();
    } catch (error) {
      toast({
        title: "Erro ao criar requisição",
        description: "Não foi possível criar a requisição.",
        variant: "destructive",
      });
    }
  }

  // ------------------------------------------------------
  // EDIT
  // ------------------------------------------------------
  async function handleEditSubmit(data: any) {
    if (!editData) return;

    try {
      await requisicoesApi.update(editData.id, data);

      toast({
        title: "Alterações salvas!",
        description: "A requisição foi atualizada com sucesso.",
      });

      setShowEditModal(false);
      setEditData(null);
      await refetch();
    } catch {
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
    } catch {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a requisição.",
        variant: "destructive",
      });
    }
  }

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
        {/* HEADER */}
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

        {/* TABELA */}
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
                onEdit={(req) => {
                  setEditData(req);
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
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
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
    </div>
  );
}
