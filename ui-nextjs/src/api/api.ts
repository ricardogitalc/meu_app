"use server";

import { MESSAGES } from "@/messages/messages";

interface LoginResponse {
  success: boolean;
  message?: string;
  error?: string;
}

const API_URL = process.env.BACKEND_URL;

export async function login(destination: string): Promise<LoginResponse> {
  if (!API_URL) {
    return { error: "URL do servidor não configurada", success: false };
  }

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destination }),
      cache: "no-store",
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, message: MESSAGES.success };
    }

    return {
      success: false,
      error: data.message || data.error || MESSAGES.defaultError,
    };
  } catch {
    return { error: MESSAGES.serverError, success: false };
  }
}

export async function verifyLogin(login_token: string): Promise<LoginResponse> {
  if (!API_URL) {
    return { error: "URL do servidor não configurada", success: false };
  }

  try {
    const response = await fetch(`${API_URL}/auth/verify-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login_token }),
      cache: "no-store",
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, message: "Login verificado com sucesso" };
    }

    return {
      success: false,
      error: data.message || data.error || "Erro ao verificar login",
    };
  } catch {
    return { error: "Erro ao conectar com servidor", success: false };
  }
}
