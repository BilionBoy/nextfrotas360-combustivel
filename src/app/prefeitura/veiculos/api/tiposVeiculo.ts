import { fetchItems } from "@/src/lib/fetchApi";
import type { GTipoVeiculo } from "@/src/@types/TipoVeiculo";

export const tiposVeiculoApi = {
  getAll: (): Promise<GTipoVeiculo[]> =>
    fetchItems<GTipoVeiculo>("/api/v1/tipos_veiculo"),
};
