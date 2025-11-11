import {
  fetchItems,
  fetchSingle,
  createItem,
  updateItem,
} from "@/lib/fetchApi";
import type {
  CRequisicaoCombustivel,
  CreateRequisicaoDTO,
} from "@/@types/RequisicaoCombustivel";

export const requisicoesApi = {
  getAll: (): Promise<CRequisicaoCombustivel[]> =>
    fetchItems<CRequisicaoCombustivel>("/api/v1/requisicoes"),

  getById: (id: number): Promise<CRequisicaoCombustivel> =>
    fetchSingle<CRequisicaoCombustivel>(`/api/v1/requisicoes/${id}`),

  create: (data: CreateRequisicaoDTO): Promise<CRequisicaoCombustivel> =>
    createItem<CRequisicaoCombustivel>("/api/v1/requisicoes", {
      c_requisicao_combustivel: data,
    }),

  update: (
    id: number,
    data: Partial<CreateRequisicaoDTO>
  ): Promise<CRequisicaoCombustivel> =>
    updateItem<CRequisicaoCombustivel>(`/api/v1/requisicoes/${id}`, {
      c_requisicao_combustivel: data,
    }),

  delete: async (id: number): Promise<void> => {
    await fetch(`/api/v1/requisicoes/${id}`, { method: "DELETE" });
  },
};
