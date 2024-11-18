import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    jwt_token: string;
    emailVerified?: Date | null;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      name: string;
      jwt_token: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    jwt_token: string;
  }
}