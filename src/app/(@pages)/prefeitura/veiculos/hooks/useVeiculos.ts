"use client";

import { useEffect, useState } from "react";
import { veiculosApi } from "../api/veiculos";
import type { GVeiculo } from "@/src/@types/Veiculo";

export function useVeiculos() {
  const [veiculos, setVeiculos] = useState<GVeiculo[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchVeiculos() {
    try {
      setLoading(true);

      const data = await veiculosApi.getAll();

      setVeiculos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("[v0] Erro ao carregar veículos:", error);
      setVeiculos([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVeiculos();
  }, []);

  return {
    veiculos,
    loading,
    refetch: fetchVeiculos,
  };
}
