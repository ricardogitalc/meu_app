/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * API
 * API documentation
 * OpenAPI spec version: 1.0
 */
import type {
  DeleteUser200,
  DeleteUserById200,
  FindUserById200,
  GetUsers200Item,
  UpdateUser200,
  UpdateUserById200,
  UpdateUserDto,
  UserDetails200,
} from "../orval-api.schemas";

/**
 * @summary Obter detalhes do usuário atual
 */
export type userDetailsResponse = {
  data: UserDetails200;
  status: number;
  headers: Headers;
};

export const getUserDetailsUrl = () => {
  return `http://localhost:3003/user/me/details`;
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

/**
 * @summary Atualizar usuário atual
 */
export type updateUserResponse = {
  data: UpdateUser200;
  status: number;
  headers: Headers;
};

export const getUpdateUserUrl = () => {
  return `http://localhost:3003/user/me/update`;
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

/**
 * @summary Deletar usuário atual
 */
export type deleteUserResponse = {
  data: DeleteUser200;
  status: number;
  headers: Headers;
};

export const getDeleteUserUrl = () => {
  return `http://localhost:3003/user/me/delete`;
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
