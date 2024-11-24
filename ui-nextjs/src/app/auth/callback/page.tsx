"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { serverLogin } from "@/auth/actions";

export default function CallbackPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    async function handleCallback() {
      try {
        const token = searchParams.get("token");
        const refreshToken = searchParams.get("refresh_token");
        const userStr = searchParams.get("user");

        if (!token || !refreshToken) {
          throw new Error("Tokens não encontrados");
        }

        const user = userStr ? JSON.parse(userStr) : null;
        await serverLogin(token, refreshToken, user);
      } catch (error) {
        console.error("Erro no callback:", error);
        window.location.href = "/login";
      }
    }

    handleCallback();
  }, [searchParams]);

  return null;
}
