// @/@types/RequisicaoCombustivel.ts

import type { GVeiculo } from "./Veiculo";
import type { CPosto } from "./Posto";
import type { CTipoCombustivel } from "./TipoCombustivel";
import type { OStatus } from "./Status";

export interface CRequisicaoCombustivel {
  id: number;
  data_emissao: string;
  km_ultimo?: number;
  km_atual?: number;
  motivo?: string;
  destino?: string;
  itinerario?: string;
  preco_unitario?: number;
  quantidade_litros?: number;
  valor_total?: number;
  completar_tanque: boolean;
  voucher_codigo?: string;
  voucher_status?: string;
  voucher_validade?: string;
  voucher_validado_em?: string;

  // 💰 Campos formatados vindos do serializer
  valor_total_formatado?: string | null;
  preco_unitario_formatado?: string | null;
  quantidade_litros_formatado?: string | null;

  c_posto?: CPosto | null;
  g_veiculo?: GVeiculo | null;
  c_tipo_combustivel?: CTipoCombustivel | null;
  o_status?: OStatus | null;
}

export interface CreateRequisicaoDTO {
  g_veiculo_id: number;
  c_posto_id: number;
  c_tipo_combustivel_id: number;
  km_atual?: number;
  destino?: string;
  quantidade_litros?: number;
  completar_tanque: boolean;
}
