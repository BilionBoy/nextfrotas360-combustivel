import { fetchItems } from "@/lib/fetchApi";
import type { CPosto } from "@/@types/Posto";

export const postosApi = {
  getAll: (): Promise<CPosto[]> => fetchItems<CPosto>("/api/v1/postos"),
};
