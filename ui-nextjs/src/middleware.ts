import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "./lib/lib";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("jwt_token")?.value;

  const protectedPaths = [
    "/assinatura",
    "/dashboard",
    "/downloads",
    "/favoritos",
    "/perfil",
    "/seguindo",
  ];

  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  const isAuthPath = [
    "/login",
    "/register",
    "/verify-login",
    "/verify-register",
  ].some((path) => request.nextUrl.pathname.startsWith(path));

  if (isProtectedPath) {
    const payload = token ? await verifyJWT(token) : null;

    if (!payload) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (isAuthPath && token) {
    const payload = await verifyJWT(token);
    if (payload) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}
