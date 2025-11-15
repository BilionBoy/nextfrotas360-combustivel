import { api } from "@/src/lib/api";
import type { CPosto } from "@/src/@types/Posto";

interface PostoListResponse {
  status: string;
  message: string;
  data: {
    pagy: Record<string, any>;
    items: CPosto[];
  };
}

interface PostoSingleResponse {
  status: string;
  message: string;
  data: CPosto;
}

export const postosApi = {
  async getAll(): Promise<CPosto[]> {
    const res = await api.get<PostoListResponse>("/api/v1/postos");
    return res.data.items;
  },

  async getById(id: number): Promise<CPosto> {
    const res = await api.get<PostoSingleResponse>(`/api/v1/postos/${id}`);
    return res.data;
  },
};
