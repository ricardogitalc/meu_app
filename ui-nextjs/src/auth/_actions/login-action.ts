"use server";

import { login } from "../api/auth";
import { LoginDto } from "../api/api.schemas";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loginAction(email: string) {
  const loginDto: LoginDto = { email };

  await delay(1500);
  const response = await login(loginDto, { cache: "no-store" });

  return {
    success: response.status === 201,
    message: response.data.message,
    ...(response.status === 201 && { data: response.data }),
  };
}
