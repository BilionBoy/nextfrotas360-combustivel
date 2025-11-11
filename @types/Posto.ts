import type { CCombustivel } from "./Combustivel"

export interface CPosto {
  id: number
  nome_fantasia: string
  razao_social?: string
  cnpj: string
  endereco?: string
  telefone?: string
  email?: string
  saldo_prepago?: number
  g_municipio_id?: number
  g_estado_id?: number
  a_status_id?: number
  created_by?: string
  updated_by?: string
  deleted_at?: string
  created_at?: string
  updated_at?: string
  combustiveis?: CCombustivel[]
}
