import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./auth/session";
import { isAuthRoute, isProtectedRoute } from "./auth/routes/routes";

export async function middleware(request: NextRequest) {
  const session = await updateSession(request);
  const path = request.nextUrl.pathname;

  // Usuário autenticado tentando acessar rotas de auth
  if (session && isAuthRoute(path)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Usuário não autenticado tentando acessar rotas protegidas
  if (!session && isProtectedRoute(path)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return session;
}
