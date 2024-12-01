"use server";

import { login } from "@/auth/auth";

export async function registerAction(response: any) {
  try {
    await login(response);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao verificar registro" };
  }
}
