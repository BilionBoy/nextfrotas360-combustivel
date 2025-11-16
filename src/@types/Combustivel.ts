// src/@types/Combustivel.ts
import type { CTipoCombustivel } from "./TipoCombustivel";
import type { FEmpresaFornecedora } from "./EmpresaFornecedora";

export interface CCombustivel {
  id: number;
  preco: number;
  validade: string;
  c_tipo_combustivel_id: number;

  created_by?: string;
  updated_by?: string;
  deleted_at?: string;
  created_at?: string;
  updated_at?: string;

  // relacionamento populado vindo do backend
  c_tipo_combustivel?: CTipoCombustivel;

  // *novo* — empresa fornecedora associada (pode ser null)
  f_empresa_fornecedora?: FEmpresaFornecedora | null;
}

export interface CreateCombustivelDTO {
  c_tipo_combustivel_id: number;
  preco: number;
  validade: string;
}
