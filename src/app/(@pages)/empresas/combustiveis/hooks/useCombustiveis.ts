// app/@pages/posto/combustiveis/hooks/useCombustiveis.ts
"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/src/components/ui/use-toast";
import { combustiveisApi } from "../api/combustiveis";
import { tiposCombustivelApi } from "../api/tiposCombustivel";
import type { CCombustivel } from "@/src/@types/Combustivel";
import type { CTipoCombustivel } from "@/src/@types/TipoCombustivel";

/**
 * Hook centralizado para controle de combustíveis:
 * - Faz o carregamento inicial
 * - Controla estado de loading e lista
 * - Expõe funções de CRUD integradas à API
 */
export function useCombustiveis() {
  const { toast } = useToast();

  const [combustiveis, setCombustiveis] = useState<CCombustivel[]>([]);
  const [tiposCombustivel, setTiposCombustivel] = useState<CTipoCombustivel[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // 🔹 Carrega todos os dados iniciais
  async function loadData() {
    setIsLoading(true);
    try {
      const [combustiveisData, tiposData] = await Promise.all([
        combustiveisApi.getAll(),
        tiposCombustivelApi.getAll(),
      ]);

      setCombustiveis(combustiveisData);
      setTiposCombustivel(tiposData);
    } catch (error) {
      console.error("[useCombustiveis] Error loading:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os combustíveis.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // 🔹 Salvar (criar ou atualizar)
  async function handleSave(data: any, id?: number) {
    try {
      const response = id
        ? await combustiveisApi.update(id, data)
        : await combustiveisApi.create(data);

      setCombustiveis((prev) =>
        id ? prev.map((c) => (c.id === id ? response : c)) : [...prev, response]
      );

      toast({
        title: "Sucesso!",
        description: id
          ? "Combustível atualizado com sucesso."
          : "Combustível adicionado com sucesso.",
      });

      setIsAddOpen(false);
    } catch (error) {
      console.error("[useCombustiveis] Save error:", error);
      toast({
        title: "Erro ao salvar combustível",
        variant: "destructive",
      });
    }
  }

  // 🔹 Deletar
  async function handleDelete(id: number) {
    try {
      await combustiveisApi.delete(id);
      setCombustiveis((prev) => prev.filter((c) => c.id !== id));
      toast({ title: "Combustível excluído com sucesso!" });
    } catch (error) {
      console.error("[useCombustiveis] Delete error:", error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o combustível.",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return {
    combustiveis,
    tiposCombustivel,
    isLoading,
    isAddOpen,
    setIsAddOpen,
    setCombustiveis,
    handleSave,
    handleDelete,
    reload: loadData,
  };
}
