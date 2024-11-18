import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import * as jose from "jose";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/verify-login",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        login_token: { type: "text" },
      },
      async authorize(credentials) {
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

          const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
          const { payload } = await jose.jwtVerify(authData.jwt_token, secret);

          const cookieStore = await cookies();
          cookieStore.set("jwt_token", authData.jwt_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          });

          return {
            id: String(payload.sub),
            email: String(payload.email),
            name: String(payload.name),
            jwt_token: authData.jwt_token,
          };
        } catch (e) {
          console.error("Erro ao verificar JWT:", e);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
          jwt_token: user.jwt_token,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          jwt_token: token.jwt_token as string,
        },
      };
    },
  },
};

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth(authConfig);
