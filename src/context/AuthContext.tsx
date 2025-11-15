"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { getToken, setToken, clearToken, api, AuthError } from "@/src/lib/api";
import type { UserDTO } from "@/src/@types/Usuario";
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [tokenState, setTokenState] = useState<string | null>(null);

  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  function setSession(token: string, userData: UserDTO) {
    setToken(token);
    setTokenState(token);
    setUser(userData);
  }

  function clearSession() {
    clearToken();
    setTokenState(null);
    setUser(null);
  }

  // restore session
  useEffect(() => {
    async function run() {
      const storedToken = getToken();
      if (!storedToken) {
        setInitializing(false);
        return;
      }

      try {
        const res = await api.get("/api/v1/auth/me");

        const userFromApi = res?.data?.user || res?.data?.data?.user;

        if (userFromApi) {
          setSession(storedToken, userFromApi);
        } else clearSession();
      } catch {
        clearSession();
      } finally {
        setInitializing(false);
      }
    }

    run();
  }, []);

  // login
  async function login(email: string, password: string) {
    setLoading(true);

    try {
      const res = await api.postRaw("/api/v1/auth/login", {
        email,
        password,
      });

      const token = res.token;
      const userData = res.user;

      if (!token || !userData) throw new Error("Resposta inesperada.");

      setSession(token, userData);

      toast({
        title: "Bem-vindo!",
        description: "Login realizado com sucesso.",
      });
    } catch (err: any) {
      toast({
        title: "Erro no login",
        description: err?.message || "Credenciais inválidas",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // redirect automático
  useEffect(() => {
    if (initializing || !user) return;

    const tipo = user.tipo_usuario?.toLowerCase();

    if (tipo === "admin") router.push("/admin");
    else if (tipo === "gestor") router.push("/prefeitura");
    else if (tipo === "fornecedor") router.push("/empresas");
    else router.push("/");
  }, [user, initializing, router]);

  function logout() {
    clearSession();
    router.push("/");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token: tokenState,
        initializing,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro do AuthProvider");
  return ctx;
}
