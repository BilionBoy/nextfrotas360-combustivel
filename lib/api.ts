// app/lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: any;
  headers?: HeadersInit;
}

/** Tipo base de todas as respostas da API */
export interface ApiResponse<T = any> {
  status: string;
  message?: string;
  data?: T;
}

/** Estrutura padrão de paginação */
export interface PaginatedResponse<T> {
  pagy: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
  items: T[];
}

async function request<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = "GET", body, headers } = options;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  console.log("[v0] API Request:", {
    url: `${BASE_URL}${endpoint}`,
    method,
    hasBody: !!body,
  });

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, config);

    console.log("[v0] API Response:", {
      status: res.status,
      ok: res.ok,
    });

    if (!res.ok) {
      let errorMsg = `Erro na API: ${res.status}`;
      try {
        const errorData = await res.json();
        errorMsg = errorData.message || errorMsg;
      } catch {
        const textError = await res.text();
        errorMsg = textError || errorMsg;
      }
      throw new Error(errorMsg);
    }

    const data = await res.json();
    console.log("[v0] API Data received:", data);
    return data as ApiResponse<T>;
  } catch (error) {
    console.error("[v0] API Error:", error);
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Não foi possível conectar à API. Verifique se o servidor está rodando em " +
          BASE_URL
      );
    }
    throw error;
  }
}

export const api = {
  get: <T = any>(endpoint: string) => request<T>(endpoint, { method: "GET" }),
  post: <T = any>(endpoint: string, body: any) =>
    request<T>(endpoint, { method: "POST", body }),
  put: <T = any>(endpoint: string, body: any) =>
    request<T>(endpoint, { method: "PUT", body }),
  delete: <T = any>(endpoint: string) =>
    request<T>(endpoint, { method: "DELETE" }),
};
