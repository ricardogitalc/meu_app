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
  DeleteUser200,
  DeleteUserById200,
  FindUserById200,
  GetUsers200Item,
  UpdateUser200,
  UpdateUserById200,
  UpdateUserDto,
  UserDetails200,
} from "../api.schemas";

/**
 * @summary Obter detalhes do usuário atual
 */
export type userDetailsResponse = {
  data: UserDetails200;
  status: number;
  headers: Headers;
};

export const getUserDetailsUrl = () => {
  return `http://localhost:3003/user/details`;
};

export const userDetails = async (
  options?: RequestInit
): Promise<userDetailsResponse> => {
  const res = await fetch(getUserDetailsUrl(), {
    ...options,
    method: "GET",
  });
  const data = await res.json();

  return { status: res.status, data, headers: res.headers };
};

export const getUserDetailsQueryKey = () => {
  return [`http://localhost:3003/user/details`] as const;
};

export const getUserDetailsQueryOptions = <
  TData = Awaited<ReturnType<typeof userDetails>>,
  TError = void
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof userDetails>>,
    TError,
    TData
  >;
  fetch?: RequestInit;
}) => {
  const { query: queryOptions, fetch: fetchOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getUserDetailsQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof userDetails>>> = ({
    signal,
  }) => userDetails({ signal, ...fetchOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof userDetails>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type UserDetailsQueryResult = NonNullable<
  Awaited<ReturnType<typeof userDetails>>
>;
export type UserDetailsQueryError = void;

/**
 * @summary Obter detalhes do usuário atual
 */

export function useUserDetails<
  TData = Awaited<ReturnType<typeof userDetails>>,
  TError = void
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof userDetails>>,
    TError,
    TData
  >;
  fetch?: RequestInit;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getUserDetailsQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * @summary Atualizar usuário atual
 */
export type updateUserResponse = {
  data: UpdateUser200;
  status: number;
  headers: Headers;
};

export const getUpdateUserUrl = () => {
  return `http://localhost:3003/user/update`;
};

export const updateUser = async (
  updateUserDto: UpdateUserDto,
  options?: RequestInit
): Promise<updateUserResponse> => {
  const res = await fetch(getUpdateUserUrl(), {
    ...options,
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(updateUserDto),
  });
  const data = await res.json();

  return { status: res.status, data, headers: res.headers };
};

export const getUpdateUserMutationOptions = <
  TError = void,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof updateUser>>,
    TError,
    { data: UpdateUserDto },
    TContext
  >;
  fetch?: RequestInit;
}): UseMutationOptions<
  Awaited<ReturnType<typeof updateUser>>,
  TError,
  { data: UpdateUserDto },
  TContext
> => {
  const { mutation: mutationOptions, fetch: fetchOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof updateUser>>,
    { data: UpdateUserDto }
  > = (props) => {
    const { data } = props ?? {};

    return updateUser(data, fetchOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type UpdateUserMutationResult = NonNullable<
  Awaited<ReturnType<typeof updateUser>>
>;
export type UpdateUserMutationBody = UpdateUserDto;
export type UpdateUserMutationError = void;

/**
 * @summary Atualizar usuário atual
 */
export const useUpdateUser = <TError = void, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof updateUser>>,
    TError,
    { data: UpdateUserDto },
    TContext
  >;
  fetch?: RequestInit;
}): UseMutationResult<
  Awaited<ReturnType<typeof updateUser>>,
  TError,
  { data: UpdateUserDto },
  TContext
> => {
  const mutationOptions = getUpdateUserMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * @summary Deletar usuário atual
 */
export type deleteUserResponse = {
  data: DeleteUser200;
  status: number;
  headers: Headers;
};

export const getDeleteUserUrl = () => {
  return `http://localhost:3003/user/delete`;
};

export const deleteUser = async (
  options?: RequestInit
): Promise<deleteUserResponse> => {
  const res = await fetch(getDeleteUserUrl(), {
    ...options,
    method: "DELETE",
  });
  const data = await res.json();

  return { status: res.status, data, headers: res.headers };
};

export const getDeleteUserMutationOptions = <
  TError = void,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteUser>>,
    TError,
    void,
    TContext
  >;
  fetch?: RequestInit;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteUser>>,
  TError,
  void,
  TContext
> => {
  const { mutation: mutationOptions, fetch: fetchOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteUser>>,
    void
  > = () => {
    return deleteUser(fetchOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteUserMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteUser>>
>;

export type DeleteUserMutationError = void;

/**
 * @summary Deletar usuário atual
 */
export const useDeleteUser = <TError = void, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteUser>>,
    TError,
    void,
    TContext
  >;
  fetch?: RequestInit;
}): UseMutationResult<
  Awaited<ReturnType<typeof deleteUser>>,
  TError,
  void,
  TContext
> => {
  const mutationOptions = getDeleteUserMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * @summary Listar todos usuários (Admin)
 */
export type getUsersResponse = {
  data: GetUsers200Item[];
  status: number;
  headers: Headers;
};

export const getGetUsersUrl = () => {
  return `http://localhost:3003/user/users`;
};

export const getUsers = async (
  options?: RequestInit
): Promise<getUsersResponse> => {
  const res = await fetch(getGetUsersUrl(), {
    ...options,
    method: "GET",
  });
  const data = await res.json();

  return { status: res.status, data, headers: res.headers };
};

export const getGetUsersQueryKey = () => {
  return [`http://localhost:3003/user/users`] as const;
};

export const getGetUsersQueryOptions = <
  TData = Awaited<ReturnType<typeof getUsers>>,
  TError = void
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>;
  fetch?: RequestInit;
}) => {
  const { query: queryOptions, fetch: fetchOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetUsersQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getUsers>>> = ({
    signal,
  }) => getUsers({ signal, ...fetchOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getUsers>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetUsersQueryResult = NonNullable<
  Awaited<ReturnType<typeof getUsers>>
>;
export type GetUsersQueryError = void;

/**
 * @summary Listar todos usuários (Admin)
 */

export function useGetUsers<
  TData = Awaited<ReturnType<typeof getUsers>>,
  TError = void
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>;
  fetch?: RequestInit;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetUsersQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * @summary Buscar usuário por ID (Admin)
 */
export type findUserByIdResponse = {
  data: FindUserById200;
  status: number;
  headers: Headers;
};

export const getFindUserByIdUrl = (id: string) => {
  return `http://localhost:3003/user/${id}`;
};

export const findUserById = async (
  id: string,
  options?: RequestInit
): Promise<findUserByIdResponse> => {
  const res = await fetch(getFindUserByIdUrl(id), {
    ...options,
    method: "GET",
  });
  const data = await res.json();

  return { status: res.status, data, headers: res.headers };
};

export const getFindUserByIdQueryKey = (id: string) => {
  return [`http://localhost:3003/user/${id}`] as const;
};

export const getFindUserByIdQueryOptions = <
  TData = Awaited<ReturnType<typeof findUserById>>,
  TError = void
>(
  id: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof findUserById>>,
      TError,
      TData
    >;
    fetch?: RequestInit;
  }
) => {
  const { query: queryOptions, fetch: fetchOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getFindUserByIdQueryKey(id);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof findUserById>>> = ({
    signal,
  }) => findUserById(id, { signal, ...fetchOptions });

  return {
    queryKey,
    queryFn,
    enabled: !!id,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof findUserById>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type FindUserByIdQueryResult = NonNullable<
  Awaited<ReturnType<typeof findUserById>>
>;
export type FindUserByIdQueryError = void;

/**
 * @summary Buscar usuário por ID (Admin)
 */

export function useFindUserById<
  TData = Awaited<ReturnType<typeof findUserById>>,
  TError = void
>(
  id: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof findUserById>>,
      TError,
      TData
    >;
    fetch?: RequestInit;
  }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getFindUserByIdQueryOptions(id, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * @summary Atualizar usuário por ID (Admin)
 */
export type updateUserByIdResponse = {
  data: UpdateUserById200;
  status: number;
  headers: Headers;
};

export const getUpdateUserByIdUrl = (id: string) => {
  return `http://localhost:3003/user/${id}`;
};

export const updateUserById = async (
  id: string,
  updateUserDto: UpdateUserDto,
  options?: RequestInit
): Promise<updateUserByIdResponse> => {
  const res = await fetch(getUpdateUserByIdUrl(id), {
    ...options,
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(updateUserDto),
  });
  const data = await res.json();

  return { status: res.status, data, headers: res.headers };
};

export const getUpdateUserByIdMutationOptions = <
  TError = void,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof updateUserById>>,
    TError,
    { id: string; data: UpdateUserDto },
    TContext
  >;
  fetch?: RequestInit;
}): UseMutationOptions<
  Awaited<ReturnType<typeof updateUserById>>,
  TError,
  { id: string; data: UpdateUserDto },
  TContext
> => {
  const { mutation: mutationOptions, fetch: fetchOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof updateUserById>>,
    { id: string; data: UpdateUserDto }
  > = (props) => {
    const { id, data } = props ?? {};

    return updateUserById(id, data, fetchOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type UpdateUserByIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof updateUserById>>
>;
export type UpdateUserByIdMutationBody = UpdateUserDto;
export type UpdateUserByIdMutationError = void;

/**
 * @summary Atualizar usuário por ID (Admin)
 */
export const useUpdateUserById = <TError = void, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof updateUserById>>,
    TError,
    { id: string; data: UpdateUserDto },
    TContext
  >;
  fetch?: RequestInit;
}): UseMutationResult<
  Awaited<ReturnType<typeof updateUserById>>,
  TError,
  { id: string; data: UpdateUserDto },
  TContext
> => {
  const mutationOptions = getUpdateUserByIdMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * @summary Deletar usuário por ID (Admin)
 */
export type deleteUserByIdResponse = {
  data: DeleteUserById200;
  status: number;
  headers: Headers;
};

export const getDeleteUserByIdUrl = (id: string) => {
  return `http://localhost:3003/user/${id}`;
};

export const deleteUserById = async (
  id: string,
  options?: RequestInit
): Promise<deleteUserByIdResponse> => {
  const res = await fetch(getDeleteUserByIdUrl(id), {
    ...options,
    method: "DELETE",
  });
  const data = await res.json();

  return { status: res.status, data, headers: res.headers };
};

export const getDeleteUserByIdMutationOptions = <
  TError = void,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteUserById>>,
    TError,
    { id: string },
    TContext
  >;
  fetch?: RequestInit;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteUserById>>,
  TError,
  { id: string },
  TContext
> => {
  const { mutation: mutationOptions, fetch: fetchOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteUserById>>,
    { id: string }
  > = (props) => {
    const { id } = props ?? {};

    return deleteUserById(id, fetchOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteUserByIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteUserById>>
>;

export type DeleteUserByIdMutationError = void;

/**
 * @summary Deletar usuário por ID (Admin)
 */
export const useDeleteUserById = <TError = void, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteUserById>>,
    TError,
    { id: string },
    TContext
  >;
  fetch?: RequestInit;
}): UseMutationResult<
  Awaited<ReturnType<typeof deleteUserById>>,
  TError,
  { id: string },
  TContext
> => {
  const mutationOptions = getDeleteUserByIdMutationOptions(options);

  return useMutation(mutationOptions);
};
