// src/@types/Usuario.ts
export type TipoUsuario = "admin" | "gestor" | "fornecedor" | string;

export interface Unidade {
  id: number;
  nome?: string;
  nome_fantasia?: string;
}

export interface Fornecedor {
  id: number;
  nome_fantasia?: string;
  razao_social?: string;
  cnpj?: string;
}

export interface UserDTO {
  id: number;
  nome: string;
  email: string;
  tipo_usuario: TipoUsuario; // corresponde ao seu serializer: "admin", "gestor", "fornecedor"
  status?: string;
  unidade?: Unidade | null;
  fornecedor?: Fornecedor | null;
  // campos opcionais que podem vir no payload
  a_cargo_id?: number | null;
  a_unidade_id?: number | null;
  // qualquer campo extra (para futuro)
  [key: string]: any;
}

export interface AuthPayload {
  token: string;
  user: UserDTO;
}
