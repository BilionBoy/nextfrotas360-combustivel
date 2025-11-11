import type { GVeiculo } from "./Veiculo";
import type { CPosto } from "./Posto";
import type { CTipoCombustivel } from "./TipoCombustivel";
import type { GCondutor } from "./Condutor";
import type { GCentroCusto } from "./CentroCusto";
import type { OStatus } from "./Status";

export interface CRequisicaoCombustivel {
  id: number;
  data_emissao: string;
  km_ultimo: number;
  km_atual: number;
  motivo?: string;
  destino?: string;
  itinerario?: string;
  preco_unitario: string;
  quantidade_litros: string;
  valor_total: string;
  completar_tanque: boolean;
  created_at: string;
  updated_at: string;
  valor_total_formatado: string;
  preco_unitario_formatado: string;
  quantidade_litros_formatado: string;

  // Relacionamentos
  c_posto?: CPosto;
  g_veiculo?: GVeiculo;
  g_condutor?: GCondutor;
  g_centro_custo?: GCentroCusto;
  c_tipo_combustivel?: CTipoCombustivel;
  o_status?: OStatus;
}

export interface CreateRequisicaoDTO {
  g_veiculo_id: number;
  c_posto_id: number;
  c_tipo_combustivel_id: number;
  g_condutor_id?: number;
  g_centro_custo_id?: number;
  km_atual?: number;
  km_ultimo?: number;
  motivo?: string;
  destino?: string;
  itinerario?: string;
  quantidade_litros?: number;
  completar_tanque?: boolean;
}
