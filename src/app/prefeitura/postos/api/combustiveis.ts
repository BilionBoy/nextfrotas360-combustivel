// src/app/prefeitura/postos/api/combustiveis.ts
import {
  fetchItems,
  fetchSingle,
  createItem,
  updateItem,
  deleteItem,
} from "@/src/lib/fetchApi";
import type {
  CCombustivel,
  CreateCombustivelDTO,
} from "@/src/@types/Combustivel";
import type { CTipoCombustivel } from "@/src/@types/TipoCombustivel";

export const combustiveisApi = {
  getAll: (): Promise<CCombustivel[]> =>
    fetchItems<CCombustivel>("/api/v1/combustiveis"),
  getById: (id: number): Promise<CCombustivel> =>
    fetchSingle<CCombustivel>(`/api/v1/combustiveis/${id}`),
  create: (payload: CreateCombustivelDTO): Promise<CCombustivel> =>
    createItem<CCombustivel>("/api/v1/combustiveis", {
      c_combustivel: {
        c_tipo_combustivel_id: payload.c_tipo_combustivel_id,
        preco: payload.preco,
        validade: new Date(payload.validade).toISOString(),
      },
    }),
  update: (id: number, payload: CreateCombustivelDTO): Promise<CCombustivel> =>
    updateItem<CCombustivel>(`/api/v1/combustiveis/${id}`, {
      c_combustivel: {
        c_tipo_combustivel_id: payload.c_tipo_combustivel_id,
        preco: payload.preco,
        validade: new Date(payload.validade).toISOString(),
      },
    }),
  delete: (id: number): Promise<void> =>
    deleteItem(`/api/v1/combustiveis/${id}`),
};

export const tiposCombustivelApi = {
  getAll: (): Promise<CTipoCombustivel[]> =>
    fetchItems<CTipoCombustivel>("/api/v1/tipos_combustiveis"),
  getById: (id: number): Promise<CTipoCombustivel> =>
    fetchSingle<CTipoCombustivel>(`/api/v1/tipos_combustiveis/${id}`),
};
