import { fetchItems } from "@/src/lib/fetchApi";
import type { CTipoCombustivel } from "@/src/@types/TipoCombustivel";

export const tiposCombustivelApi = {
  getAll: (): Promise<CTipoCombustivel[]> =>
    fetchItems<CTipoCombustivel>("/api/v1/tipos_combustivel"),
};
