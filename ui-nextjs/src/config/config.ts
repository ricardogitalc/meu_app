export const AUTH_TIMES = {
  access_token_duration: "1m",
  access_token_ms: 60 * 1000, // 1 minuto em milissegundos
  refresh_token_duration: "5m",
  refresh_token_ms: 5 * 60 * 1000, // 5 minutos em milissegundos (corrigido)
} as const;

export const AUHT_MENSSAGES = {
  invalidEmail: "Por favor, insira um email válido",
  confirmEmail: "Os emails não coincidem",
  firstNameError: "Mínimo 2 caracteres",
  lastNameError: "Mínimo 2 caracteres",
  minWhatsappError: "WhatsApp é obrigatório",
  regexWhatsappError: "WhatsApp deve estar no formato: 11999999999",
} as const;
