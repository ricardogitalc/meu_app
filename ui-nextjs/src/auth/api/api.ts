"use server";

import {
  AuthResponse,
  LoginResponse,
  RegisterResponse,
  User,
} from "../interfaces/interfaces";

const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:3003";

// Funções de Autenticação
export async function sendMagicLink(
  destination: string
): Promise<LoginResponse & { status: number }> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ destination }),
  });

  const data = await response.json();
  return { ...data, status: response.status };
}

export async function verifyLogin(loginToken: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/verify-login`, {
    headers: { "login-token": loginToken },
  });
  return response.json();
}

export async function verifyRegister(
  registerToken: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/verify-register`, {
    headers: { "register-token": registerToken },
  });
  return response.json();
}

export async function refreshToken(
  refreshToken: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    headers: { "refresh-token": refreshToken },
  });
  return response.json();
}

// Funções de Usuário
export async function registerUser(userData: {
  email: string;
  firstName: string;
  lastName: string;
  whatsappNumber?: string;
}): Promise<RegisterResponse & { status: number }> {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  return { ...data, status: response.status };
}

export async function listUsers(params: {
  skip?: number;
  take?: number;
  jwt_token: string;
}): Promise<User[]> {
  const queryParams = new URLSearchParams();
  if (params.skip) queryParams.append("skip", params.skip.toString());
  if (params.take) queryParams.append("take", params.take.toString());

  const response = await fetch(`${API_BASE_URL}/users/all?${queryParams}`, {
    headers: { Authorization: `Bearer ${params.jwt_token}` },
  });
  return response.json();
}

export async function getUser(id: number, jwt_token: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${jwt_token}` },
  });
  return response.json();
}

export async function updateUser(
  id: number,
  jwt_token: string,
  userData: {
    firstName?: string;
    lastName?: string;
    whatsappNumber?: string;
    imageUrl?: string;
  }
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt_token}`,
    },
    body: JSON.stringify(userData),
  });
  return response.json();
}

export async function deleteUser(
  id: number,
  jwt_token: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${jwt_token}` },
  });
  return response.json();
}
