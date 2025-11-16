"use client";

import { useState, useEffect } from "react";
import { centrosCustoApi } from "../api/centrosCusto";
import type { GCentroCusto } from "@/src/@types/CentroCusto";

export function useCentrosCusto() {
  const [centros, setCentros] = useState<GCentroCusto[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchCentros() {
    try {
      setLoading(true);
      const data = await centrosCustoApi.getAll();
      setCentros(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar centros de custo:", err);
      setCentros([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchCentros();
  }, []);

  return {
    centros,
    loading,
    refetch: fetchCentros,
  };
}
