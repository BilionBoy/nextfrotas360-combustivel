import { api } from "@/src/lib/api"
import type { Frotista } from "@/src/@types/Frotista"

interface FrotistaListResponse {
  status: string
  message: string
  data: { items: Frotista[] }
}

export const frotistasApi = {
  async getAll(): Promise<Frotista[]> {
    const res = await api.get<FrotistaListResponse>("/api/v1/frotistas")
    return res.data.items
  },

  async create(frotista: Partial<Frotista>): Promise<Frotista> {
    const res = await api.post<{ data: Frotista }>("/api/v1/frotistas", frotista)
    return res.data
  },

  async update(id: number, frotista: Partial<Frotista>): Promise<Frotista> {
    const res = await api.put<{ data: Frotista }>(`/api/v1/frotistas/${id}`, frotista)
    return res.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/v1/frotistas/${id}`)
  },
}
