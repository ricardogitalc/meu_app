"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";

const secretKey =
  "986c0859540006e4aa01aea281858ec3a8e673aa311b112bc87f5d6de0e2389b";
const key = new TextEncoder().encode(secretKey);

export async function serverLogin(
  token: string,
  refreshToken: string,
  user: any
) {
  try {
    await jwtVerify(token, key);

    const cookieStore = await cookies();

    await Promise.all([
      cookieStore.set("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      }),
      cookieStore.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      }),
    ]);

    redirect("/");
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    redirect("/login?error=auth");
  }
}
