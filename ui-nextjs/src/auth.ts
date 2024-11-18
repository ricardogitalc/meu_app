import NextAuth from "next-auth";
import { authConfig } from "./app/api/auth/[...nextauth]/route";
import { cookies } from "next/headers";

export const { auth, signIn, signOut: originalSignOut } = NextAuth(authConfig);

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.set("jwt_token", "", {
    expires: new Date(0),
    path: "/",
  });

  await originalSignOut();
}
