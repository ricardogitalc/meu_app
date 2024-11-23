import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./auth/lib";
import { isAuthRoute, isProtectedRoute } from "./auth/routes/routes";

export async function middleware(request: NextRequest) {
  console.log("⭐ Middleware - Iniciando...");
  console.log("📍 Path:", request.nextUrl.pathname);
  console.log("🍪 Cookies:", {
    accessToken: request.cookies.get("accessToken")?.value
      ? "Presente"
      : "Ausente",
    refreshToken: request.cookies.get("refreshToken")?.value
      ? "Presente"
      : "Ausente",
  });

  const response = await updateSession(request);

  console.log("🔄 Resposta do updateSession:", !!response);

  if (!response) {
    // Sem sessão e sem refresh token
    if (isProtectedRoute(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (isAuthRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}
