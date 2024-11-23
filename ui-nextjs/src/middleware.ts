import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./auth/lib";
import { isAuthRoute, isProtectedRoute } from "./auth/routes/routes";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const path = request.nextUrl.pathname;

  if (response?.session && isAuthRoute(path)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!response?.session && isProtectedRoute(path)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response?.response || NextResponse.next();
}
