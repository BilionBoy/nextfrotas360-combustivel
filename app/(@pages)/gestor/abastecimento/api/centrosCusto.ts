import { fetchItems } from "@/lib/fetchApi";
import type { GCentroCusto } from "@/@types/CentroCusto";

export const centrosCustoApi = {
  getAll: (): Promise<GCentroCusto[]> =>
    fetchItems<GCentroCusto>("/api/v1/centros_custo"),
};
