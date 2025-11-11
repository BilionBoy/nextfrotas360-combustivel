export interface Usuario {
  id: number
  nome: string
  email: string
  cpf: string
  tipo: "posto" | "gestor" | "admin"
  ativo?: boolean
  criado_em?: string
  atualizado_em?: string
}
