"use client";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const login_token = searchParams.get("login_token");

  useEffect(() => {
    const verifyLogin = async () => {
      if (!login_token) return;

      try {
        const result = await signIn("credentials", {
          login_token,
          redirect: false,
        });

        if (result?.error) {
          router.push("/login?error=token-invalido-ou-expirado");
          return;
        }

        if (result?.ok) {
          window.location.href = "/dashboard";
        }
      } catch (error) {
        router.push("/login?error=falha-autenticacao");
      }
    };

    verifyLogin();
  }, [login_token, router]);

  if (!login_token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg text-red-600 mb-4">
          Token de acesso não encontrado
        </p>
        <p className="text-sm text-gray-600">
          Verifique se você está acessando através do link correto enviado por
          email.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
    </div>
  );
}
