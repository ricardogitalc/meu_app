export const AUTH_TIMES = {
  JWT_TOKEN: "3m",
  LOGIN_TOKEN: "3m",
  REFRESH_TOKEN: "10m",
} as const;

export const AUHT_MENSSAGES = {
  invalidEmail: "Por favor, insira um email válido",
  confirmEmail: "Os emails não coincidem",
  firstNameError: "Mínimo 2 caracteres",
  lastNameError: "Mínimo 2 caracteres",
  minWhatsappError: "WhatsApp é obrigatório",
  regexWhatsappError: "WhatsApp deve estar no formato: 11999999999",
} as const;

export const AUTH_GOOGLE = {
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3003",
  defaultRedirect: "/",
  loginPath: "/login",
  errors: {
    invalidToken: "Token inválido ou expirado",
    authFailed: "Falha na autenticação",
  },
} as const;
