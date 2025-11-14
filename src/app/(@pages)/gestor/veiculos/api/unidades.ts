import { fetchItems } from "@/src/lib/fetchApi";
import type { AUnidade } from "@/src/@types/Unidade";

export const unidadesApi = {
  getAll: (): Promise<AUnidade[]> => fetchItems<AUnidade>("/api/v1/unidades"),
};
