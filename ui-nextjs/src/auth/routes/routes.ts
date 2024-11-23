export const publicRoutes = ["/", "/planos"];

export const protectedRoutes = ["/dashboard", "/profile", "/test-auth"];

export const authRoutes = ["/login", "/register"];

export const isPublicRoute = (path: string) =>
  publicRoutes.some((route) => path.startsWith(route));

export const isProtectedRoute = (path: string) =>
  protectedRoutes.some((route) => path.startsWith(route));

export const isAuthRoute = (path: string) =>
  authRoutes.some((route) => path.startsWith(route));
