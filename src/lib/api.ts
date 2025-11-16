const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: any;
  headers?: HeadersInit;
}

/** Tipo base usado pelo restante da API */
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
  } catch {}
}

export function clearToken() {
  try {
    if (typeof window === "undefined") return;
    localStorage.removeItem("token");
  } catch {}
}

/* ============================================================
   REQUEST PADRÃO (retorna ApiResponse<T>)
   Usado em TODA A API EXCETO LOGIN
============================================================ */
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

  console.log("[v0] API Request:", { url: `${BASE_URL}${endpoint}`, method });

  const res = await fetch(`${BASE_URL}${endpoint}`, config);

  console.log("[v0] API Response:", {
    url: `${BASE_URL}${endpoint}`,
    status: res.status,
    ok: res.ok,
  });

  if (res.status === 401 || res.status === 403) {
    let msg = "Não autorizado";
    try {
      const json = await res.json();
      msg = json.message || msg;
    } catch {}
    throw new AuthError(msg, res.status);
  }

  if (!res.ok) {
    let msg = `Erro na API (${res.status})`;
    try {
      const json = await res.json();
      msg = json.message || msg;
    } catch {}
    throw new Error(msg);
  }

  const data = await res.json();
  return data as ApiResponse<T>;
}

/*  Usado EXCLUSIVAMENTE PARA LOGIN =*/
async function requestRaw(endpoint: string, body: any) {
  console.log("[v0] API Raw Request:", endpoint);

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Erro ${res.status}`);
  }

  return await res.json();
}

export const api = {
  get: <T = any>(endpoint: string) => request<T>(endpoint),
  post: <T = any>(endpoint: string, body: any) =>
    request<T>(endpoint, { method: "POST", body }),
  postRaw: (endpoint: string, body: any) => requestRaw(endpoint, body),
  put: <T = any>(endpoint: string, body: any) =>
    request<T>(endpoint, { method: "PUT", body }),
  patch: <T = any>(endpoint: string, body: any) =>
    request<T>(endpoint, { method: "PATCH", body }),
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
