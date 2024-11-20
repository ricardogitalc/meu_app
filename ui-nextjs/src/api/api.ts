import { User } from "next-auth";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyLoginResponse,
} from "./interfaces/interfaces";

const API_BASE_URL = process.env.BACKEND_URL;

// Funções de Autenticação
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Falha no login");
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
  if (!response.ok) throw new Error("Falha na verificação do login");
  return response.json();
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
  if (!response.ok) throw new Error("Falha no registro");
  return response.json();
};

export const verifyRegister = async (
  registerToken: string
): Promise<VerifyLoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/verify-register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ register_token: registerToken }),
  });
  if (!response.ok) throw new Error("Falha na verificação do registro");
  return response.json();
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
  if (!response.ok) throw new Error("Falha ao buscar usuários");
  return response.json();
};

export const getUser = async (token: string, id: number): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Falha ao buscar usuário");
  return response.json();
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
  if (!response.ok) throw new Error("Falha ao atualizar usuário");
  return response.json();
};

// Status do servidor
export const getServerStatus = async (): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/`);
  if (!response.ok) throw new Error("Falha ao verificar status do servidor");
  return response.text();
};
