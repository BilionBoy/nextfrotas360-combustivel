import {
  fetchItems,
  fetchSingle,
  createItem,
  updateItem,
} from "@/lib/fetchApi";
import type { CCombustivel, CreateCombustivelDTO } from "@/@types/Combustivel";

export const combustiveisApi = {
  /** Lista todos os combustíveis */
  getAll: (): Promise<CCombustivel[]> =>
    fetchItems<CCombustivel>("/api/v1/combustiveis"),

  /** Busca um combustível pelo ID */
  getById: (id: number): Promise<CCombustivel> =>
    fetchSingle<CCombustivel>(`/api/v1/combustiveis/${id}`),

  /** Cria um novo combustível */
  create: (data: CreateCombustivelDTO): Promise<CCombustivel> => {
    const payload = {
      c_combustivel: {
        c_tipo_combustivel_id: data.c_tipo_combustivel_id,
        preco: data.preco,
        validade: new Date(data.validade).toISOString(),
      },
    };
    return createItem<CCombustivel>("/api/v1/combustiveis", payload);
  },

  /** Atualiza um combustível existente */
  update: (id: number, data: CreateCombustivelDTO): Promise<CCombustivel> => {
    const payload = {
      c_combustivel: {
        c_tipo_combustivel_id: data.c_tipo_combustivel_id,
        preco: data.preco,
        validade: new Date(data.validade).toISOString(),
      },
    };
    return updateItem<CCombustivel>(`/api/v1/combustiveis/${id}`, payload);
  },

  /** Exclui um combustível */
  delete: (id: number): Promise<void> =>
    fetch(`/api/v1/combustiveis/${id}`, { method: "DELETE" }).then(() => {}),
};
