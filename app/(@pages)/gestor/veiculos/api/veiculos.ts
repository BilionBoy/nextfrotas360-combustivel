import { api } from "@/lib/api"
import type { GVeiculo } from "@/@types/Veiculo"

interface VeiculoListResponse {
  status: string
  message: string
  data: {
    pagy: Record<string, any>
    items: GVeiculo[]
  }
}

interface VeiculoSingleResponse {
  status: string
  message: string
  data: GVeiculo
}

export const veiculosApi = {
  async getAll(): Promise<GVeiculo[]> {
    const res = await api.get<VeiculoListResponse>("/api/v1/veiculos")
    return res.data.items
  },

  async getById(id: number): Promise<GVeiculo> {
    const res = await api.get<VeiculoSingleResponse>(`/api/v1/veiculos/${id}`)
    return res.data
  },

  async create(data: Partial<GVeiculo>): Promise<GVeiculo> {
    const res = await api.post<VeiculoSingleResponse>("/api/v1/veiculos", {
      g_veiculo: data,
    })
    return res.data
  },

  async update(id: number, data: Partial<GVeiculo>): Promise<GVeiculo> {
    const res = await api.put<VeiculoSingleResponse>(`/api/v1/veiculos/${id}`, {
      g_veiculo: data,
    })
    return res.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/v1/veiculos/${id}`)
  },
}
