// src/app/(@pages)/gestor/abastecimento/hooks/useRequisicoes.ts

"use client";

import { useEffect, useState } from "react";
import { requisicoesApi } from "../api/requisicoes";
import type { CRequisicaoCombustivel } from "@/src/@types/RequisicaoCombustivel";

export function useRequisicoes() {
  const [requisicoes, setRequisicoes] = useState<CRequisicaoCombustivel[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchRequisicoes() {
    try {
      setLoading(true);
      const data = await requisicoesApi.getAll();
      setRequisicoes(data);
    } catch (err) {
      console.error("Erro ao carregar requisicoes:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRequisicoes();
  }, []);

  return { requisicoes, loading, refetch: fetchRequisicoes };
}
