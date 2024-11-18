import NextAuth from "next-auth";
import { cookies } from "next/headers";

export const {
  auth,
  signIn,
  signOut: originalSignOut,
} = NextAuth({
  pages: {
    signIn: "/verify-login",
  },
  providers: [],
});

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.set("jwt_token", "", {
    expires: new Date(0),
    path: "/",
  });

  await originalSignOut();
}
