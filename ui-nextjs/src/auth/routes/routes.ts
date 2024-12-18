export const publicRoutes = ["/", "/planos", "/login-test"];

export const protectedRoutes = [
  "/assinatura",
  "/dashboard",
  "/downloads",
  "/favoritos",
  "/perfil",
  "/seguindo",
];

export const authRoutes = [
  "/login",
  "/register",
  "/verify-login",
  "/verify-register",
  "/google-callback",
];

export const isPublicRoute = (path: string) =>
  publicRoutes.some((route) => path.startsWith(route));

export const isProtectedRoute = (path: string) =>
  protectedRoutes.some((route) => path.startsWith(route));

export const isAuthRoute = (path: string) =>
  authRoutes.some((route) => path.startsWith(route));
