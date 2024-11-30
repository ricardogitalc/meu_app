/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * API
 * API documentation
 * OpenAPI spec version: 1.0
 */
import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  MutationFunction,
  QueryFunction,
  QueryKey,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import type {
  CreateUserDto,
  Login201,
  LoginDto,
  RefreshToken200,
  RegisterUser201,
  VerifyLogin200,
  VerifyRegister200,
} from "../api.schemas";

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

export const getLoginMutationOptions = <
  TError = void,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof login>>,
    TError,
    { data: LoginDto },
    TContext
  >;
  fetch?: RequestInit;
}): UseMutationOptions<
  Awaited<ReturnType<typeof login>>,
  TError,
  { data: LoginDto },
  TContext
> => {
  const { mutation: mutationOptions, fetch: fetchOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof login>>,
    { data: LoginDto }
  > = (props) => {
    const { data } = props ?? {};

    return login(data, fetchOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type LoginMutationResult = NonNullable<
  Awaited<ReturnType<typeof login>>
>;
export type LoginMutationBody = LoginDto;
export type LoginMutationError = void;

/**
 * @summary Enviar magic link para login
 */
export const useLogin = <TError = void, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof login>>,
    TError,
    { data: LoginDto },
    TContext
  >;
  fetch?: RequestInit;
}): UseMutationResult<
  Awaited<ReturnType<typeof login>>,
  TError,
  { data: LoginDto },
  TContext
> => {
  const mutationOptions = getLoginMutationOptions(options);

  return useMutation(mutationOptions);
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

export const getRegisterUserMutationOptions = <
  TError = void,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof registerUser>>,
    TError,
    { data: CreateUserDto },
    TContext
  >;
  fetch?: RequestInit;
}): UseMutationOptions<
  Awaited<ReturnType<typeof registerUser>>,
  TError,
  { data: CreateUserDto },
  TContext
> => {
  const { mutation: mutationOptions, fetch: fetchOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof registerUser>>,
    { data: CreateUserDto }
  > = (props) => {
    const { data } = props ?? {};

    return registerUser(data, fetchOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type RegisterUserMutationResult = NonNullable<
  Awaited<ReturnType<typeof registerUser>>
>;
export type RegisterUserMutationBody = CreateUserDto;
export type RegisterUserMutationError = void;

/**
 * @summary Criar novo usuário
 */
export const useRegisterUser = <TError = void, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof registerUser>>,
    TError,
    { data: CreateUserDto },
    TContext
  >;
  fetch?: RequestInit;
}): UseMutationResult<
  Awaited<ReturnType<typeof registerUser>>,
  TError,
  { data: CreateUserDto },
  TContext
> => {
  const mutationOptions = getRegisterUserMutationOptions(options);

  return useMutation(mutationOptions);
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
    ...options,
    method: "GET",
  });
  const data = await res.json();

  return { status: res.status, data, headers: res.headers };
};

export const getVerifyLoginQueryKey = () => {
  return [`http://localhost:3003/auth/verify-login`] as const;
};

export const getVerifyLoginQueryOptions = <
  TData = Awaited<ReturnType<typeof verifyLogin>>,
  TError = void
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof verifyLogin>>,
    TError,
    TData
  >;
  fetch?: RequestInit;
}) => {
  const { query: queryOptions, fetch: fetchOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getVerifyLoginQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof verifyLogin>>> = ({
    signal,
  }) => verifyLogin({ signal, ...fetchOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof verifyLogin>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type VerifyLoginQueryResult = NonNullable<
  Awaited<ReturnType<typeof verifyLogin>>
>;
export type VerifyLoginQueryError = void;

/**
 * @summary Verificar magic link
 */

export function useVerifyLogin<
  TData = Awaited<ReturnType<typeof verifyLogin>>,
  TError = void
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof verifyLogin>>,
    TError,
    TData
  >;
  fetch?: RequestInit;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getVerifyLoginQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

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
  });
  const data = await res.json();

  return { status: res.status, data, headers: res.headers };
};

export const getVerifyRegisterQueryKey = () => {
  return [`http://localhost:3003/auth/verify-register`] as const;
};

export const getVerifyRegisterQueryOptions = <
  TData = Awaited<ReturnType<typeof verifyRegister>>,
  TError = void
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof verifyRegister>>,
    TError,
    TData
  >;
  fetch?: RequestInit;
}) => {
  const { query: queryOptions, fetch: fetchOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getVerifyRegisterQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof verifyRegister>>> = ({
    signal,
  }) => verifyRegister({ signal, ...fetchOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof verifyRegister>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type VerifyRegisterQueryResult = NonNullable<
  Awaited<ReturnType<typeof verifyRegister>>
>;
export type VerifyRegisterQueryError = void;

/**
 * @summary Verificar registro de usuário
 */

export function useVerifyRegister<
  TData = Awaited<ReturnType<typeof verifyRegister>>,
  TError = void
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof verifyRegister>>,
    TError,
    TData
  >;
  fetch?: RequestInit;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getVerifyRegisterQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

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

export const getGoogleLoginQueryKey = () => {
  return [`http://localhost:3003/auth/google`] as const;
};

export const getGoogleLoginQueryOptions = <
  TData = Awaited<ReturnType<typeof googleLogin>>,
  TError = string
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof googleLogin>>,
    TError,
    TData
  >;
  fetch?: RequestInit;
}) => {
  const { query: queryOptions, fetch: fetchOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGoogleLoginQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof googleLogin>>> = ({
    signal,
  }) => googleLogin({ signal, ...fetchOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof googleLogin>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GoogleLoginQueryResult = NonNullable<
  Awaited<ReturnType<typeof googleLogin>>
>;
export type GoogleLoginQueryError = string;

/**
 * @summary Iniciar autenticação com Google
 */

export function useGoogleLogin<
  TData = Awaited<ReturnType<typeof googleLogin>>,
  TError = string
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof googleLogin>>,
    TError,
    TData
  >;
  fetch?: RequestInit;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGoogleLoginQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

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

export const getGoogleCallbackQueryKey = () => {
  return [`http://localhost:3003/auth/google/callback`] as const;
};

export const getGoogleCallbackQueryOptions = <
  TData = Awaited<ReturnType<typeof googleCallback>>,
  TError = string
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof googleCallback>>,
    TError,
    TData
  >;
  fetch?: RequestInit;
}) => {
  const { query: queryOptions, fetch: fetchOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGoogleCallbackQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof googleCallback>>> = ({
    signal,
  }) => googleCallback({ signal, ...fetchOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof googleCallback>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GoogleCallbackQueryResult = NonNullable<
  Awaited<ReturnType<typeof googleCallback>>
>;
export type GoogleCallbackQueryError = string;

/**
 * @summary Callback da autenticação Google
 */

export function useGoogleCallback<
  TData = Awaited<ReturnType<typeof googleCallback>>,
  TError = string
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof googleCallback>>,
    TError,
    TData
  >;
  fetch?: RequestInit;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGoogleCallbackQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

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

export const getRefreshTokenQueryKey = () => {
  return [`http://localhost:3003/auth/refresh-token`] as const;
};

export const getRefreshTokenQueryOptions = <
  TData = Awaited<ReturnType<typeof refreshToken>>,
  TError = void
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof refreshToken>>,
    TError,
    TData
  >;
  fetch?: RequestInit;
}) => {
  const { query: queryOptions, fetch: fetchOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getRefreshTokenQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof refreshToken>>> = ({
    signal,
  }) => refreshToken({ signal, ...fetchOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof refreshToken>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type RefreshTokenQueryResult = NonNullable<
  Awaited<ReturnType<typeof refreshToken>>
>;
export type RefreshTokenQueryError = void;

/**
 * @summary Renovar token de acesso
 */

export function useRefreshToken<
  TData = Awaited<ReturnType<typeof refreshToken>>,
  TError = void
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof refreshToken>>,
    TError,
    TData
  >;
  fetch?: RequestInit;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getRefreshTokenQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}
