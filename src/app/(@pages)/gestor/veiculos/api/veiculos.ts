import {
  fetchItems,
  fetchSingle,
  createItem,
  updateItem,
} from "@/src/lib/fetchApi";

import type { GVeiculo, CreateGVeiculoDTO } from "@/src/@types/Veiculo";

export const veiculosApi = {
  /** Lista todos */
  getAll: (): Promise<GVeiculo[]> => fetchItems<GVeiculo>("/api/v1/veiculos"),

  /** Busca único */
  getById: (id: number): Promise<GVeiculo> =>
    fetchSingle<GVeiculo>(`/api/v1/veiculos/${id}`),

  /** Cria veículo */
  create: (data: CreateGVeiculoDTO): Promise<GVeiculo> =>
    createItem<GVeiculo>("/api/v1/veiculos", {
      g_veiculo: data,
    }),

  /** Atualiza veículo */
  update: (id: number, data: Partial<CreateGVeiculoDTO>): Promise<GVeiculo> =>
    updateItem<GVeiculo>(`/api/v1/veiculos/${id}`, {
      g_veiculo: data,
    }),

  /** Exclui */
  delete: async (id: number): Promise<void> => {
    await fetch(`/api/v1/veiculos/${id}`, { method: "DELETE" });
  },
};
