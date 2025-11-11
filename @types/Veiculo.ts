export interface GVeiculo {
  id: number
  placa: string
  chassi?: string
  renavam?: string
  modelo: string
  ano: number
  marca: string
  cor?: string
  km_atual?: string
  horimetro?: number
  a_status_id: number
  g_tipo_veiculo_id: number
  a_unidade_id: number
  g_centro_custo_id: number
  created_by?: string
  updated_by?: string
  deleted_at?: string
  created_at?: string
  updated_at?: string
}
