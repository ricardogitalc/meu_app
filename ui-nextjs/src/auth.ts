import NextAuth from "next-auth";

export const { auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/verify-login",
  },
  providers: [],
});
