import * as jose from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET_KEY!;
const key = new TextEncoder().encode(JWT_SECRET);

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, key);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function setAuthCookie(jwt_token: string) {
  const cookieStore = await cookies();
  cookieStore.set("jwt_token", jwt_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function getAuthCookie() {
  const cookieStore = await cookies();
  return cookieStore.get("jwt_token")?.value;
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set("jwt_token", "", {
    expires: new Date(0),
    path: "/",
  });
}
