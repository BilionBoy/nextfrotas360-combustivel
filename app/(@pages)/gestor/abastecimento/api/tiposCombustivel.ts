import { fetchItems } from "@/lib/fetchApi";
import type { CTipoCombustivel } from "@/@types/TipoCombustivel";

export const tiposCombustivelApi = {
  getAll: (): Promise<CTipoCombustivel[]> =>
    fetchItems<CTipoCombustivel>("/api/v1/tipos_combustivel"),
};
