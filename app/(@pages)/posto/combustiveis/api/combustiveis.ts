import { api } from "@/lib/api"
import type { CCombustivel, CreateCombustivelDTO } from "@/@types/Combustivel"

interface CombustivelListResponse {
  status: string
  message: string
  data: {
    pagy: Record<string, any>
    items: CCombustivel[]
  }
}

interface CombustivelSingleResponse {
  status: string
  message: string
  data: CCombustivel
}

export const combustiveisApi = {
  async getAll(): Promise<CCombustivel[]> {
    const res = await api.get<CombustivelListResponse>("/api/v1/combustiveis")
    return res.data.items
  },

  async getById(id: number): Promise<CCombustivel> {
    const res = await api.get<CombustivelSingleResponse>(`/api/v1/combustiveis/${id}`)
    return res.data
  },

  async create(data: CreateCombustivelDTO): Promise<CCombustivel> {
    const payload = {
      c_combustivel: {
        c_tipo_combustivel_id: data.c_tipo_combustivel_id,
        preco: data.preco,
        validade: new Date(data.validade).toISOString(),
      },
    }

    const res = await api.post<CombustivelSingleResponse>("/api/v1/combustiveis", payload)
    return res.data
  },

  async update(id: number, data: CreateCombustivelDTO): Promise<CCombustivel> {
    const payload = {
      c_combustivel: {
        c_tipo_combustivel_id: data.c_tipo_combustivel_id,
        preco: data.preco,
        validade: new Date(data.validade).toISOString(),
      },
    }

    const res = await api.put<CombustivelSingleResponse>(`/api/v1/combustiveis/${id}`, payload)
    return res.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/v1/combustiveis/${id}`)
  },
}
