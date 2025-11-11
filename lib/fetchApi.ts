// app/lib/fetchApi.ts
import { api, ApiResponse, PaginatedResponse } from "@/lib/api";

/**
 * Retorna um array de items de qualquer endpoint no formato padrão:
 * { status, message, data: { pagy, items } }
 */
export async function fetchItems<T>(url: string): Promise<T[]> {
  try {
    const res = await api.get<ApiResponse<PaginatedResponse<T>>>(url);

    // Força o TS a entender que res.data existe e tem items
    const paginated = res.data as PaginatedResponse<T> | undefined;
    const items = paginated?.items ?? [];

    console.log(`[v0] Loaded ${url}: ${items.length} items`);
    return items;
  } catch (error) {
    console.error(`[v0] Error fetching ${url}:`, error);
    return [];
  }
}

/**
 * Retorna um único objeto do endpoint no formato padrão:
 * { status, message, data: { ... } }
 */
export async function fetchSingle<T>(url: string): Promise<T> {
  const res = await api.get<ApiResponse<T>>(url);
  return res.data as T;
}

/**
 * Cria um novo registro.
 */
export async function createItem<T>(url: string, payload: any): Promise<T> {
  const res = await api.post<ApiResponse<T>>(url, payload);
  return res.data as T;
}

/**
 * Atualiza um registro existente.
 */
export async function updateItem<T>(url: string, payload: any): Promise<T> {
  const res = await api.put<ApiResponse<T>>(url, payload);
  return res.data as T;
}
