import type {
  CreateUserDto,
  Login201,
  LoginDto,
  Logout200,
  RefreshToken200,
  RegisterUser201,
  VerifyLogin200,
  VerifyRegister200,
} from "../orval-api.schemas";

/**
 * @summary Enviar magic link para login
 */
export type loginResponse = {
  data: Login201;
  status: number;
  headers: Headers;
};

export const getLoginUrl = () => {
  return `http://localhost:3003/auth/login`;
};

export const login = async (
  loginDto: LoginDto,
  options?: RequestInit
): Promise<loginResponse> => {
  const res = await fetch(getLoginUrl(), {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(loginDto),
  });
  const data = await res.json();

  return { status: res.status, data, headers: res.headers };
};

/**
 * @summary Criar novo usuário
 */
export type registerUserResponse = {
  data: RegisterUser201;
  status: number;
  headers: Headers;
};

export const getRegisterUserUrl = () => {
  return `http://localhost:3003/auth/register`;
};

export const registerUser = async (
  createUserDto: CreateUserDto,
  options?: RequestInit
): Promise<registerUserResponse> => {
  const res = await fetch(getRegisterUserUrl(), {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(createUserDto),
  });
  const data = await res.json();

  return { status: res.status, data, headers: res.headers };
};

/**
 * @summary Verificar magic link
 */
export type verifyLoginResponse = {
  data: VerifyLogin200;
  status: number;
  headers: Headers;
};

export const getVerifyLoginUrl = () => {
  return `http://localhost:3003/auth/verify-login`;
};

export const verifyLogin = async (
  options?: RequestInit
): Promise<verifyLoginResponse> => {
  const res = await fetch(getVerifyLoginUrl(), {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });
  const data = await res.json();
  return {
    status: res.status,
    data,
    headers: res.headers,
  };
};

/**
 * @summary Verificar registro de usuário
 */
export type verifyRegisterResponse = {
  data: VerifyRegister200;
  status: number;
  headers: Headers;
};

export const getVerifyRegisterUrl = () => {
  return `http://localhost:3003/auth/verify-register`;
};

export const verifyRegister = async (
  options?: RequestInit
): Promise<verifyRegisterResponse> => {
  const res = await fetch(getVerifyRegisterUrl(), {
    ...options,
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();

  return { status: res.status, data, headers: res.headers };
};

/**
 * @summary Iniciar autenticação com Google
 */
export type googleLoginResponse = {
  data: unknown;
  status: number;
  headers: Headers;
};

export const getGoogleLoginUrl = () => {
  return `http://localhost:3003/auth/google`;
};

export const googleLogin = async (
  options?: RequestInit
): Promise<googleLoginResponse> => {
  const res = await fetch(getGoogleLoginUrl(), {
    ...options,
    method: "GET",
  });
  const data = await res.json();

  return { status: res.status, data, headers: res.headers };
};

/**
 * @summary Callback da autenticação Google
 */
export type googleCallbackResponse = {
  data: unknown;
  status: number;
  headers: Headers;
};

export const getGoogleCallbackUrl = () => {
  return `http://localhost:3003/auth/google/callback`;
};

export const googleCallback = async (
  options?: RequestInit
): Promise<googleCallbackResponse> => {
  const res = await fetch(getGoogleCallbackUrl(), {
    ...options,
    method: "GET",
  });
  const data = await res.json();

  return { status: res.status, data, headers: res.headers };
};

/**
 * @summary Renovar token de acesso
 */
export type refreshTokenResponse = {
  data: RefreshToken200;
  status: number;
  headers: Headers;
};

export const getRefreshTokenUrl = () => {
  return `http://localhost:3003/auth/refresh-token`;
};

export const refreshToken = async (
  options?: RequestInit
): Promise<refreshTokenResponse> => {
  const res = await fetch(getRefreshTokenUrl(), {
    ...options,
    method: "GET",
  });
  const data = await res.json();

  return { status: res.status, data, headers: res.headers };
};

/**
 * @summary Fazer logout do usuário
 */
export type logoutResponse = {
  data: Logout200;
  status: number;
  headers: Headers;
};

export const getLogoutUrl = () => {
  return `http://localhost:3003/auth/logout`;
};

export const logout = async (
  options?: RequestInit
): Promise<logoutResponse> => {
  const res = await fetch(getLogoutUrl(), {
    ...options,
    method: "GET",
  });
  const data = await res.json();

  return { status: res.status, data, headers: res.headers };
};
