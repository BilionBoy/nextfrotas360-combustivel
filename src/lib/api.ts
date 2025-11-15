// src/lib/api.ts
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

/** Error específico para auth (401/403) */
export class AuthError extends Error {
  public status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

/** Token helpers — centralizam onde o token fica */
export function getToken(): string | null {
  try {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}

export function setToken(token: string) {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem("token", token);
  } catch {
    /* ignore */
  }
}

export function clearToken() {
  try {
    if (typeof window === "undefined") return;
    localStorage.removeItem("token");
  } catch {
    /* ignore */
  }
}

/** request principal */
async function request<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = "GET", body, headers } = options;
  const token = getToken();

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
      url: `${BASE_URL}${endpoint}`,
      status: res.status,
      ok: res.ok,
    });

    // Tratamento especial auth
    if (res.status === 401 || res.status === 403) {
      // tenta extrair mensagem do body
      let errMsg = "Não autorizado";
      try {
        const errData = await res.json();
        errMsg = errData.message || errMsg;
      } catch {
        // fallback: status text
        errMsg = res.statusText || errMsg;
      }
      throw new AuthError(errMsg, res.status);
    }

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
  } catch (error: any) {
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

export interface PaginatedResponse<T = any> {
  pagy: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
  items: T[];
}
