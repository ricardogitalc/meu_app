"use server";

import {
  AuthResponse,
  LoginResponse,
  RegisterResponse,
  User,
} from "../interfaces/interfaces";

const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:3003";

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
    headers: { loginToken: loginToken },
  });
  const data = await response.json();
  return { ...data, status: response.status };
}

export async function verifyRegister(
  registerToken: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/verify-register`, {
    headers: { registerToken: registerToken },
  });
  return response.json();
}

export async function refreshToken(
  refreshToken: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    headers: { refreshToken: refreshToken },
  });
  return response.json();
}

export async function registerUser(userData: {
  email: string;
  firstName: string;
  lastName: string;
  whatsappNumber?: string;
}): Promise<RegisterResponse & { status: number }> {
  const response = await fetch(`${API_BASE_URL}/user/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  return { ...data, status: response.status };
}

export async function allUsers(params: {
  skip?: number;
  take?: number;
  accessToken: string;
}): Promise<User[]> {
  const queryParams = new URLSearchParams();
  if (params.skip) queryParams.append("skip", params.skip.toString());
  if (params.take) queryParams.append("take", params.take.toString());

  const response = await fetch(`${API_BASE_URL}/user/all?${queryParams}`, {
    headers: { Authorization: `Bearer ${params.accessToken}` },
  });
  return response.json();
}

export async function getUser(id: number, accessToken: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/user/details/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.json();
}

export async function updateUser(
  userId: number,
  userData: {
    firstName?: string;
    lastName?: string;
    whatsappNumber?: string;
    imageUrl?: string;
  }
): Promise<{
  success: boolean;
  message?: string;
  accessToken?: string;
  user?: User;
}> {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return { success: false, message: "Token não encontrado" };
    }

    const response = await fetch(`${API_BASE_URL}/user/update/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: Array.isArray(data.message)
          ? data.message[0]
          : data.message || `Erro ${data.statusCode}: ${data.error}`,
      };
    }

    if (data.accessToken) {
      await cookieStore.set("accessToken", data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }

    return {
      success: true,
      accessToken: data.accessToken,
      user: data.user,
    };
  } catch (error) {
    return { success: false, message: "Erro ao conectar com o servidor" };
  }
}

export async function deleteUser(
  id: number,
  accessToken: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/user/delete/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.json();
}

export async function handleGoogleCallback(
  code: string
): Promise<LoginResponse> {
  const response = await fetch(
    `${API_BASE_URL}/auth/google/callback?code=${code}`,
    {
      method: "GET",
    }
  );
  const data = await response.json();

  if (!data.accessToken || !data.refreshToken || !data.user) {
    throw new Error("Resposta inválida do servidor");
  }

  return data as LoginResponse;
}
