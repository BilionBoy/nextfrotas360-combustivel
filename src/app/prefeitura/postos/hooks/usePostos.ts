"use client";

import { useState, useEffect, useMemo } from "react";
import type { CPosto } from "@/src/@types/Posto";
import { postosApi } from "../api/postos";
import { useToast } from "@/src/components/ui/use-toast";

export function usePostos() {
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [postos, setPostos] = useState<CPosto[]>([]);
  const [filteredPostos, setFilteredPostos] = useState<CPosto[]>([]);
  const [loading, setLoading] = useState(true);

  // ---------------------------------------
  // 🔄 Carregar postos
  // ---------------------------------------
  useEffect(() => {
    loadPostos();
  }, []);

  async function loadPostos() {
    try {
      setLoading(true);
      const data = await postosApi.getAll();
      setPostos(data);
      setFilteredPostos(data);
    } catch {
      toast({
        title: "Erro ao carregar postos",
        description: "Não foi possível carregar a lista de postos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  // ---------------------------------------
  // 🔍 Buscar
  // ---------------------------------------
  function handleSearch() {
    const term = searchTerm.toLowerCase();

    if (!term.trim()) return setFilteredPostos(postos);

    const filtered = postos.filter(
      (posto) =>
        posto.nome_fantasia.toLowerCase().includes(term) ||
        (posto.endereco?.toLowerCase() ?? "").includes(term)
    );

    setFilteredPostos(filtered);
  }

  // ---------------------------------------
  // 🟢 Calcular menor preço geral
  // ---------------------------------------
  const cheapestPrice = useMemo(() => {
    const prices: number[] = [];

    postos.forEach((p) => {
      p.combustiveis?.forEach((c) => prices.push(Number(c.preco)));
    });

    return prices.length > 0 ? Math.min(...prices) : Infinity;
  }, [postos]);

  return {
    searchTerm,
    setSearchTerm,
    postos,
    filteredPostos,
    loading,
    loadPostos,
    handleSearch,
    cheapestPrice,
  };
}
