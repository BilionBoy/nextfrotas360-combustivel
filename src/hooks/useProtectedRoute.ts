"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import type { TipoUsuario } from "@/src/@types/Usuario";

interface UseProtectedRouteOptions {
  allowed: TipoUsuario[]; // roles permitidas
}

export function useProtectedRoute({ allowed }: UseProtectedRouteOptions) {
  const { user, initializing } = useAuth();
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Espera carregar sessão inicial
    if (initializing) return;

    // Não autenticado → volta para login
    if (!user) {
      router.push("/");
      return;
    }

    // Verificação por role
    if (!allowed.includes(user.tipo_usuario)) {
      router.push("/");
      return;
    }

    // Permissão OK
    setAuthorized(true);
  }, [user, initializing, router, allowed]);

  return { authorized };
}
