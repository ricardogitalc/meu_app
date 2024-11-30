export const CONFIG_MESSAGES = {
  UserLogged: 'Login verificado com sucesso',
  JwtTokenExpired: 'O token é inválido ou expirou.',
  LoginTokenExpired: 'O link de acesso expirou.',
  UserNotFound: 'Usuário não encontrado.',
  UserAlReady: 'O usuário já existe.',
  AdminOnly: 'Você não é um administrador.',
  InvalidEmail: 'Insira um email válido.',
  EmailNotVerified: 'Usuário não verificado.',
  UserCreatedVerified: 'Usuário verificado.',
  UpdateUserSucess: 'Usuário atualizado.',
  UserDeletedSucess: 'Usuário deletado com sucesso.',
  GoogleLoginError: 'Ocorreu um erro ao tentar entrar com Google.',
  SendVerificationLink:
    'Usuário criado. Verifique seu email para ativar a conta.',
  TooManyRequests: 'Muitas tentativas. Aguarde um momento e tente novamente.',
  RefreshTokenExpired: 'O refresh token expirou. Faça login novamente.',
  UserNotPermission: 'Acesso negado, você só pode acessar suas informações.',
} as const;

export const JWT_TIMES = {
  LOGIN_TOKEN: '15m',
  REGISTER_TOKEN: '15m',
  ACCESS_TOKEN: '15m',
  REFRESH_TOKEN: '1d',
} as const;

export const JWT_CONFIG = {
  algorithm: 'HS256',
  encoding: 'UTF8',
  noTimestamp: true,
} as const;
