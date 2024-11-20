export const CONFIG_TIMES = {
  JWT_TOKEN: '5m',
  LOGIN_TOKEN: '1m',
};

export const CONFIG_MESSAGES = {
  JwtTokenExpired: 'O token é inválido ou expirou.',
  LoginTokenExpired: 'O link de acesso expirou.',
  UserNotFound: 'Usuário não encontrado.',
  UserAlReady: 'O usuário já está cadastrado.',
  AdminOnly: 'Você não é um administrador.',
  InvalidEmail: 'Insira um email válido.',
  EmailNotVerified: 'O email ainda não foi verificado.',
  UserCreatedVerified: 'Usuário verificado com sucesso.',
  SendVerificationLink:
    'Usuário criado. Verifique seu email para ativar a conta.',
  TooManyRequests:
    'Muitas tentativas realizadas. Aguarde um momento e tente novamente.',
};
