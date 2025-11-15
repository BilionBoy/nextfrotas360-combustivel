import { api, ApiResponse, PaginatedResponse, AuthError } from "@/src/lib/api";

/**  Retorna um array de items de qualquer endpoint no formato padrão: */
export async function fetchItems<T>(url: string): Promise<T[]> {
  try {
    const res = await api.get<ApiResponse<PaginatedResponse<T>>>(url);

    const paginated = res.data as PaginatedResponse<T> | undefined;
    const items = paginated?.items ?? [];

    console.log(`[v0] Loaded ${url}: ${items.length} items`);
    return items;
  } catch (error) {
    console.error(`[v0] Error fetching ${url}:`, error);

    // Se for erro de autenticação, repassa para ser tratado no AuthProvider
    if (error instanceof AuthError) {
      throw error;
    }

    // Em erros comuns, retorna vazio (comportamento anterior)
    return [];
  }
}

/*** Retorna um único objeto do endpoint no formato padrão:* { status, message, data: { ... } }*/
export async function fetchSingle<T>(url: string): Promise<T> {
  try {
    const res = await api.get<ApiResponse<T>>(url);
    return res.data as T;
  } catch (error) {
    console.error(`[v0] Error fetching single ${url}:`, error);

    if (error instanceof AuthError) {
      throw error;
    }

    throw error;
  }
}

/* Cria um novo registr*/
export async function createItem<T>(url: string, payload: any): Promise<T> {
  try {
    const res = await api.post<ApiResponse<T>>(url, payload);
    return res.data as T;
  } catch (error) {
    console.error(`[v0] Error creating ${url}:`, error);

    if (error instanceof AuthError) {
      throw error;
    }

    throw error;
  }
}

/* Atualiza um registro existente. */
export async function updateItem<T>(url: string, payload: any): Promise<T> {
  try {
    const res = await api.put<ApiResponse<T>>(url, payload);
    return res.data as T;
  } catch (error) {
    console.error(`[v0] Error updating ${url}:`, error);

    if (error instanceof AuthError) {
      throw error;
    }

    throw error;
  }
}
