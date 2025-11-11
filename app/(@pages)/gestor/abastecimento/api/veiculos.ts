import { fetchItems } from "@/lib/fetchApi";
import type { GVeiculo } from "@/@types/Veiculo";

export const veiculosApi = {
  getAll: (): Promise<GVeiculo[]> => fetchItems<GVeiculo>("/api/v1/veiculos"),
};
