// src/app/(@pages)/gestor/abastecimento/api/requisicoes.ts

import {
  fetchItems,
  fetchSingle,
  createItem,
  updateItem,
} from "@/src/lib/fetchApi";
import type {
  CRequisicaoCombustivel,
  CreateRequisicaoDTO,
} from "@/src/@types/RequisicaoCombustivel";

export const requisicoesApi = {
  /** Lista todas */
  getAll: (): Promise<CRequisicaoCombustivel[]> =>
    fetchItems<CRequisicaoCombustivel>("/api/v1/requisicoes"),

  /** Busca uma */
  getById: (id: number): Promise<CRequisicaoCombustivel> =>
    fetchSingle<CRequisicaoCombustivel>(`/api/v1/requisicoes/${id}`),

  /** Cria */
  create: (data: CreateRequisicaoDTO): Promise<CRequisicaoCombustivel> =>
    createItem("/api/v1/requisicoes", {
      c_requisicao_combustivel: data,
    }),

  /** Atualiza */
  update: (
    id: number,
    data: Partial<CreateRequisicaoDTO>
  ): Promise<CRequisicaoCombustivel> =>
    updateItem(`/api/v1/requisicoes/${id}`, {
      c_requisicao_combustivel: data,
    }),

  /** Exclui */
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`/api/v1/requisicoes/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(`Erro ao excluir requisicao (${id})`);
    }

    return;
  },
};
