"use server";

import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
  VerifyLoginResponse,
} from "../interfaces/interfaces";

const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:3003";

// Funções de Autenticação
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return response.json();
};

export const verifyLogin = async (
  loginToken: string
): Promise<VerifyLoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/verify-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login_token: loginToken }),
  });
  const responseData = await response.json();
  if (!response.ok) throw new Error(responseData.message);
  return responseData;
};

// Funções de Usuário
export const registerUser = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const responseData = await response.json();
  if (!response.ok) throw new Error(responseData.message);
  return responseData;
};

export const verifyRegister = async (
  registerToken: string
): Promise<VerifyLoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/verify-register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ register_token: registerToken }),
  });
  const responseData = await response.json();
  if (!response.ok) throw new Error(responseData.message);
  return responseData;
};

export const getAllUsers = async (
  token: string,
  skip?: number,
  take?: number
): Promise<User[]> => {
  const params = new URLSearchParams();
  if (skip !== undefined) params.append("skip", skip.toString());
  if (take !== undefined) params.append("take", take.toString());

  const response = await fetch(`${API_BASE_URL}/users/all?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const responseData = await response.json();
  if (!response.ok) throw new Error(responseData.message);
  return responseData;
};

export const getUser = async (token: string, id: number): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const responseData = await response.json();
  if (!response.ok) throw new Error(responseData.message);
  return responseData;
};

export const updateUser = async (
  token: string,
  id: number,
  data: Partial<User>
): Promise<{ message: string; user: User }> => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const responseData = await response.json();
  if (!response.ok) throw new Error(responseData.message);
  return responseData;
};

// Status do servidor
export const getServerStatus = async (): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/`);
  const responseData = await response.json();
  if (!response.ok) throw new Error(responseData.message);
  return responseData;
};
