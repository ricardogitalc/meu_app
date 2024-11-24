"use server";

import { cookies } from "next/headers";
import type { User } from "@/types/user";

export async function serverLogin(
  jwt_token: string,
  refresh_token: string,
  user: User
) {
  const cookieStore = await cookies();

  cookieStore.set("accessToken", jwt_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  cookieStore.set("refreshToken", refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return user;
}
