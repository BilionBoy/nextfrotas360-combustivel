import { fetchItems } from "@/lib/fetchApi";
import type { GTipoVeiculo } from "@/@types/TipoVeiculo";

export const tiposVeiculoApi = {
  getAll: (): Promise<GTipoVeiculo[]> =>
    fetchItems<GTipoVeiculo>("/api/v1/tipos_veiculo"),
};
