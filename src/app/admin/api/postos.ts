import { api } from "@/src/lib/api"
import type { Posto } from "@/src/@types/Posto"

interface PostoListResponse {
  status: string
  message: string
  data: { items: Posto[] }
}

export const postosApi = {
  async getAll(): Promise<Posto[]> {
    const res = await api.get<PostoListResponse>("/api/v1/postos")
    return res.data.items
  },

  async create(posto: Partial<Posto>): Promise<Posto> {
    const res = await api.post<{ data: Posto }>("/api/v1/postos", posto)
    return res.data
  },

  async update(id: number, posto: Partial<Posto>): Promise<Posto> {
    const res = await api.put<{ data: Posto }>(`/api/v1/postos/${id}`, posto)
    return res.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/v1/postos/${id}`)
  },
}
