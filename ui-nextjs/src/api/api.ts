"use server";

import { MESSAGES } from "@/messages/messages";

interface LoginResponse {
  success: boolean;
  message?: string;
  error?: string;
}

const API_URL = process.env.BACKEND_URL || "http://localhost:3003";

export async function login(destination: string): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destination }),
    });

    return await response.json();
  } catch {
    return { error: MESSAGES.serverError, success: false };
  }
}

export async function verifyLogin(login_token: string): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/verify-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login_token }),
    });

    return await response.json();
  } catch (error) {
    console.error("Erro na verificação:", error);
    return { error: "Erro ao conectar com servidor", success: false };
  }
}
