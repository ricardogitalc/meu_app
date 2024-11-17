import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { MESSAGES } from "@/messages/messages";
import { COOKIE_EXPIRATION_TIME } from "./constant/constant";

const API_URL = process.env.BACKEND_URL || "http://localhost:3003";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log(`\n=== Requisição para: ${pathname} ===`);

  // Se for verify-login, extrair o token da URL
  if (pathname === "/verify-login") {
    const url = new URL(request.url);
    const login_token = url.searchParams.get("login_token");
    console.log("\n=== VERIFY-LOGIN DEBUG ===");
    console.log("JWT Token da URL:", login_token?.substring(0, 20) + "...");

    // Criar resposta
    const resp = NextResponse.next();

    if (login_token) {
      // Configurar cookie com o token da URL
      resp.cookies.set("jwt_token", login_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: COOKIE_EXPIRATION_TIME,
      });

      // Log do cookie configurado
      const jwtCookie = resp.cookies.get("jwt_token");
      console.log("JWT Cookie configurado:", jwtCookie ? "Sim" : "Não");
      console.log(
        "JWT Cookie valor:",
        jwtCookie?.value?.substring(0, 20) + "..."
      );
    }

    return resp;
  }

  // Para outras rotas, apenas verificar se existe o jwt_token
  const jwtToken = request.cookies.get("jwt_token");
  console.log("JWT Token nas cookies:", jwtToken ? "Presente" : "Ausente");

  return NextResponse.next();
}

export const config = {
  matcher: ["/verify-login", "/dashboard/:path*", "/dashboard"],
};
