import { fetchItems } from "@/lib/fetchApi";
import type { GCondutor } from "@/@types/Condutor";

export const condutoresApi = {
  getAll: (): Promise<GCondutor[]> =>
    fetchItems<GCondutor>("/api/v1/condutores"),
};
