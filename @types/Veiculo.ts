import type { OStatus } from "./Status";
import type { GTipoVeiculo } from "./TipoVeiculo";
import type { AUnidade } from "./Unidade";
import type { GCentroCusto } from "./CentroCusto";

export interface GVeiculo {
  id: number;
  placa: string;
  chassi?: string;
  renavam?: string;
  modelo: string;
  ano: number;
  marca?: string;
  cor?: string;
  km_atual?: string;
  created_at: string;
  updated_at: string;

  a_status?: OStatus;
  g_tipo_veiculo?: GTipoVeiculo;
  a_unidade?: AUnidade;
  g_centro_custo?: GCentroCusto;
}

// DTO (para criar/atualizar)
export interface CreateGVeiculoDTO {
  placa: string;
  modelo: string;
  marca?: string;
  ano: number;
  cor?: string;
  chassi?: string;
  renavam?: string;
  km_atual?: string;
  a_status_id: number;
  g_tipo_veiculo_id: number;
  a_unidade_id: number;
  g_centro_custo_id: number;
}
