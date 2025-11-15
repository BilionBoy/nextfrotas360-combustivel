import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ROTAS PÚBLICAS (podem ser acessadas sem login)
const PUBLIC_ROUTES = ["/"];

// ROTAS PROTEGIDAS (precisam de token no client) - Middleware **não** valida token — isso é no AuthProvider
const PRIVATE_PREFIXES = ["/admin", "/prefeitura", "/empresas"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Evitar loop na página de login, o token não pode ser lido no middleware (localStorage não existe no server).
  // Então usamos um truque: se já está autenticado no client, ele será redirecionado no AuthProvider. Para o servidor, deixamos passar a rota "/" normalmente.
  const isPrivate = PRIVATE_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isPrivate) {
    // Como o server não tem acesso ao token do localStorage, redirecionamos para login sempre que é rota privada.
    // O cliente (AuthProvider) vai corrigir caso o user esteja logado.
    const loginUrl = new URL("/", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Prosseguir normalmente
  return NextResponse.next();
}

// Quais rotas passam pelo middleware
export const config = {
  matcher: ["/", "/admin/:path*", "/prefeitura/:path*", "/empresas/:path*"],
};
