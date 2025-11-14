import { api } from "@/src/lib/api"
import type { Usuario } from "@/src/@types/Usuario"

interface UsuarioListResponse {
  status: string
  message: string
  data: { items: Usuario[] }
}

export const usuariosApi = {
  async getAll(): Promise<Usuario[]> {
    const res = await api.get<UsuarioListResponse>("/api/v1/usuarios")
    return res.data.items
  },

  async create(usuario: Partial<Usuario>): Promise<Usuario> {
    const res = await api.post<{ data: Usuario }>("/api/v1/usuarios", usuario)
    return res.data
  },

  async update(id: number, usuario: Partial<Usuario>): Promise<Usuario> {
    const res = await api.put<{ data: Usuario }>(`/api/v1/usuarios/${id}`, usuario)
    return res.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/v1/usuarios/${id}`)
  },
}
