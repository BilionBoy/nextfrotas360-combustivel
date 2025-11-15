"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { getToken, setToken, clearToken, api, AuthError } from "@/src/lib/api";

import type { UserDTO, AuthPayload } from "@/src/@types/Usuario";
import { useRouter } from "next/navigation";
import { useToast } from "@/src/components/ui/use-toast";

interface AuthContextValue {
  user: UserDTO | null;
  token: string | null;
  initializing: boolean;
  loading: boolean;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// PROVIDER
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { toast } = useToast();

  const [user, setUser] = useState<UserDTO | null>(null);
  const [tokenState, setTokenState] = useState<string | null>(null);

  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);

  // Salva sessão
  function setSession(token: string, userData: UserDTO) {
    setToken(token);
    setTokenState(token);
    setUser(userData);
  }

  // Limpa sessão
  function clearSession() {
    clearToken();
    setTokenState(null);
    setUser(null);
  }

  // Carrega sessão no início
  async function restoreSession() {
    const storedToken = getToken();
    if (!storedToken) {
      setInitializing(false);
      return;
    }

    try {
      setLoading(true);

      const res = await api.get<{ user: UserDTO }>("/api/v1/auth/me");

      if (res.data?.user) {
        setSession(storedToken, res.data.user);
      } else {
        clearSession();
      }
    } catch (err) {
      if (err instanceof AuthError) {
        clearSession();
      }
    } finally {
      setLoading(false);
      setInitializing(false);
    }
  }

  useEffect(() => {
    restoreSession();
  }, []);

  // LOGIN REAL
  async function login(email: string, password: string) {
    setLoading(true);

    try {
      const res = await api.post<AuthPayload>("/api/v1/auth/login", {
        email,
        password,
      });

      if (!res.data?.token || !res.data?.user) {
        throw new Error("Resposta inesperada do servidor");
      }

      const token = res.data.token;
      const userData = res.data.user;

      setSession(token, userData);

      // REDIRECIONAMENTO POR ROLE
      const tipo = userData.tipo_usuario;

      if (tipo === "admin") {
        router.push("/admin");
      } else if (tipo === "gestor") {
        router.push("/prefeitura");
      } else if (tipo === "fornecedor") {
        router.push("/empresas");
      } else {
        router.push("/"); // fallback
      }

      toast({
        title: "Bem-vindo!",
        description: "Login realizado com sucesso.",
      });
    } catch (err: any) {
      console.error("Erro no login:", err);

      toast({
        title: "Erro ao fazer login",
        description: err?.message || "Credenciais inválidas",
        variant: "destructive",
      });

      throw err;
    } finally {
      setLoading(false);
    }
  }

  // LOGOUT
  function logout() {
    clearSession();
    router.push("/");

    toast({
      title: "Sessão encerrada",
      description: "Você saiu do sistema.",
    });
  }

  // TRATAMENTO GLOBAL DE AUTHERROR
  useEffect(() => {
    const handleAuthError = (event: any) => {
      if (event?.detail instanceof AuthError) {
        clearSession();
        router.push("/");

        toast({
          title: "Sessão expirada",
          description: "Faça login novamente.",
          variant: "destructive",
        });
      }
    };

    window.addEventListener("auth-error", handleAuthError);
    return () => window.removeEventListener("auth-error", handleAuthError);
  }, [router, toast]);

  // VALUE
  const value: AuthContextValue = {
    user,
    token: tokenState,
    initializing,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// HOOK
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
