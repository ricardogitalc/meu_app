export const AUTH_TIMES = {
  access_token_duration: 10, // duração em segundos
  refresh_token_duration: 120, // duração em segundos
} as const;

export const AUHT_MENSSAGES = {
  invalidEmail: "Por favor, insira um email válido",
  confirmEmail: "Os emails não coincidem",
  firstNameError: "Mínimo 2 caracteres",
  lastNameError: "Mínimo 2 caracteres",
  minWhatsappError: "WhatsApp é obrigatório",
  regexWhatsappError: "WhatsApp deve estar no formato: 11999999999",
} as const;
