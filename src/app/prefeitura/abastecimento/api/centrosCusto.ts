import { fetchItems } from "@/src/lib/fetchApi";
import type { GCentroCusto } from "@/src/@types/CentroCusto";

export const centrosCustoApi = {
  getAll: (): Promise<GCentroCusto[]> =>
    fetchItems<GCentroCusto>("/api/v1/centros_custo"),
};
