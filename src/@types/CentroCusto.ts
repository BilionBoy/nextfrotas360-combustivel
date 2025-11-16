export interface GCentroCusto {
  id: number;
  nome: string;
  codigo_dotacao: string;
  valor_inicial: number;
  saldo_atual: number;
  g_tipo_centro_custo?: {
    id: number;
    descricao: string;
  };
}
