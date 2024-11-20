import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./lib/lib";
import { isAuthRoute, isProtectedRoute } from "./routes/routes";

export async function middleware(request: NextRequest) {
  const session = await updateSession(request);
  const path = request.nextUrl.pathname;
  console.log("path:", path);

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
