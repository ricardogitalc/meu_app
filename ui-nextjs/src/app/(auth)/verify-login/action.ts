"use server";

import { login } from "@/auth/lib";

export async function loginAction(response: any) {
  try {
    await login(response);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao fazer login" };
  }
}
