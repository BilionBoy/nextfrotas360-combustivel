import { fetchItems, fetchSingle } from "@/src/lib/fetchApi";
import type { CPosto } from "@/src/@types/Posto";

export const postosApi = {
  getAll: () => fetchItems<CPosto>("/api/v1/postos"), // <- pronto!

  getById: (id: number) => fetchSingle<CPosto>(`/api/v1/postos/${id}`),
};
