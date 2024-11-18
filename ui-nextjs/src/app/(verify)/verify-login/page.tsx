"use client";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [tokenProcessed, setTokenProcessed] = useState(false);
  const [status, setStatus] = useState("Iniciando verificação...");
  const login_token = searchParams.get("login_token");

  useEffect(() => {
    const verifyLogin = async () => {
      if (!login_token) {
        setStatus("Token de login não encontrado. Verifique a URL.");
        return;
      }

      if (!tokenProcessed) {
        setStatus("Verificando token...");

        try {
          const result = await signIn("credentials", {
            login_token,
            redirect: false,
          });

          if (result?.ok) {
            setStatus("Login verificado, redirecionando...");
            router.push("/dashboard");
          } else {
            setStatus(
              `Erro na verificação: ${result?.error || "Falha na autenticação"}`
            );
          }
        } catch (error) {
          setStatus("Erro inesperado durante a verificação");
        }
        setTokenProcessed(true);
      }
    };

    verifyLogin();
  }, [login_token, tokenProcessed, router]);

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
      <div className="mb-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
      <p className="text-lg text-gray-700">{status}</p>
    </div>
  );
}
