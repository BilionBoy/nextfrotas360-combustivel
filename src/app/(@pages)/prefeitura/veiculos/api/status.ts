import { fetchItems } from "@/src/lib/fetchApi";
import type { OStatus } from "@/src/@types/Status";

export const statusApi = {
  getAll: (): Promise<OStatus[]> => fetchItems<OStatus>("/api/v1/status"),
};
