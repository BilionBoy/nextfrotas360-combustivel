import { fetchItems } from "@/lib/fetchApi";
import type { AUnidade } from "@/@types/Unidade";

export const unidadesApi = {
  getAll: (): Promise<AUnidade[]> => fetchItems<AUnidade>("/api/v1/unidades"),
};
