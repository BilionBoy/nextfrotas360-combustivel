import { fetchItems } from "@/src/lib/fetchApi";
import type { GVeiculo } from "@/src/@types/Veiculo";

export const veiculosApi = {
  getAll: (): Promise<GVeiculo[]> => fetchItems<GVeiculo>("/api/v1/veiculos"),
};
