"use client"

import { useEffect, useState } from "react"
import { veiculosApi } from "../api/veiculos"
import type { Veiculo } from "@/@types/Veiculo"

export function useVeiculos() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchVeiculos() {
    setLoading(true)
    const data = await veiculosApi.getAll()
    setVeiculos(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchVeiculos()
  }, [])

  return { veiculos, loading, refetch: fetchVeiculos }
}
