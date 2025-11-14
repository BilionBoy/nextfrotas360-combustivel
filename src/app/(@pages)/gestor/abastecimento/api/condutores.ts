import { fetchItems } from "@/src/lib/fetchApi";
import type { GCondutor } from "@/src/@types/Condutor";

export const condutoresApi = {
  getAll: (): Promise<GCondutor[]> =>
    fetchItems<GCondutor>("/api/v1/condutores"),
};
