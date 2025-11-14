import type { CTipoCombustivel } from "./TipoCombustivel"

export interface CCombustivel {
  id: number
  preco: number
  validade: string
  c_tipo_combustivel_id: number
  created_by?: string
  updated_by?: string
  deleted_at?: string
  created_at?: string
  updated_at?: string

  // Relacionamento populado
  tipo_combustivel?: CTipoCombustivel
}

export interface CreateCombustivelDTO {
  c_tipo_combustivel_id: number
  preco: number
  validade: string
}
