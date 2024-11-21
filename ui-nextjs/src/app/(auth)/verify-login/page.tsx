"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyLogin } from "@/auth/api/api";
import { useSession } from "@/auth/session-provider";

export default function VerifyLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useSession();

  useEffect(() => {
    async function verifyLoginToken() {
      try {
        const loginToken = searchParams.get("login_token");
        if (!loginToken) {
          router.replace("/login?error=token-invalido-ou-expirado");
          return;
        }

        const { jwt_token } = await verifyLogin(loginToken);
        await login(jwt_token); // Salva o token JWT na sessão
        router.replace("/"); // Redireciona para página inicial após login
      } catch (error) {
        router.replace("/login?error=falha-autenticacao");
      }
    }

    verifyLoginToken();
  }, [searchParams, router, login]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Verificando login...</p>
    </div>
  );
}
