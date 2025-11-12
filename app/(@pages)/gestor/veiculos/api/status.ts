import { fetchItems } from "@/lib/fetchApi";
import type { OStatus } from "@/@types/Status";

export const statusApi = {
  getAll: (): Promise<OStatus[]> => fetchItems<OStatus>("/api/v1/status"),
};
