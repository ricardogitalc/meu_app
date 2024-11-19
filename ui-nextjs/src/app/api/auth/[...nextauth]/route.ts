import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import * as jose from "jose";
import type { JWT } from "next-auth/jwt";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/verify-login",
    error: "/login", // Adicionando página de erro
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

          if (response.status === 401) return null;
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

          const userData = {
            id: String(payload.sub),
            email: String(payload.email),
            firstName: String(payload.firstName),
            lastName: String(payload.lastName),
            role: String(payload.role),
            jwt_token: authData.jwt_token,
          };

          return userData;
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  cookies: {
    sessionToken: {
      name: "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id || "",
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          role: token.role || "",
          jwt_token: user.jwt_token || "",
        } satisfies JWT;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          id: token.id || "",
          firstName: token.firstName || "",
          lastName: token.lastName || "",
          email: token.email || "",
          role: token.role || "",
          jwt_token: token.jwt_token || "",
        },
      };
    },
  },
};

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth(authConfig);
