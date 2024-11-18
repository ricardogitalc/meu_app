import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/verify-login",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        login_token: { type: "text" },
      },
      async authorize(credentials, request) {
        if (!credentials?.login_token) {
          return null;
        }

        try {
          const response = await fetch(
            "http://localhost:3003/auth/verify-login",
            {
              method: "POST",
              body: JSON.stringify({
                login_token: credentials.login_token,
              }),
              headers: { "Content-Type": "application/json" },
            }
          );

          if (response.status !== 201) return null;

          const authData = await response.json();
          if (!authData.jwt_token) return null;

          const cookieStore = await cookies();
          cookieStore.set("jwt_token", authData.jwt_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          });

          return {
            id: authData.sub,
            email: authData.email || "",
            name: authData.name || "",
            jwt_token: authData.jwt_token,
          };
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      return { ...session, ...token };
    },
  },
};

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth(authConfig);
