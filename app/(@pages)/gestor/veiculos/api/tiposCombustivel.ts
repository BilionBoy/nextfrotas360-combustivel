import { api } from "@/lib/api"
import type { CTipoCombustivel } from "@/@types/TipoCombustivel"

interface TipoListResponse {
  status: string
  message: string
  data: { items: CTipoCombustivel[] }
}

export const tiposCombustivelApi = {
  async getAll(): Promise<CTipoCombustivel[]> {
    const res = await api.get<TipoListResponse>("/api/v1/tipos_combustivel")
    return res.data.items
  },
}
