export const CONFIG_TIMES = {
  JWT_TOKEN: '5m',
  LOGIN_TOKEN: '5m',
  REFRESH_TOKEN: '1d',
} as const;

export const CONFIG_MESSAGES = {
  JwtTokenExpired: 'O token é inválido ou expirou.',
  LoginTokenExpired: 'O link de acesso expirou.',
  UserNotFound: 'Usuário não encontrado.',
  UserAlReady: 'O usuário já existe.',
  AdminOnly: 'Você não é um administrador.',
  InvalidEmail: 'Insira um email válido.',
  EmailNotVerified: 'Usuário não verificado.',
  UserCreatedVerified: 'Usuário verificado com sucesso.',
  UpdateUserSucess: 'Usuário atualizado com sucesso.',
  UserDeletedSucess: 'Usuário deletado com sucesso.',
  GoogleLoginError: 'Ocorreu um erro ao tentar entrar com Google.',
  SendVerificationLink:
    'Usuário criado. Verifique seu email para ativar a conta.',
  TooManyRequests:
    'Muitas tentativas realizadas. Aguarde um momento e tente novamente.',
  RefreshTokenExpired: 'O refresh token expirou. Faça login novamente.',
} as const;
