import { fetchItems } from "@/src/lib/fetchApi";
import type { CPosto } from "@/src/@types/Posto";

export const postosApi = {
  getAll: (): Promise<CPosto[]> => fetchItems<CPosto>("/api/v1/postos"),
};
