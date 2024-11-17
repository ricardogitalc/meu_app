"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { verifyLogin } from "@/api/api";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<{ error?: string; success?: string }>(
    {}
  );
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    async function verify() {
      const login_token = searchParams.get("login_token");

      if (!login_token) {
        setStatus({ error: "Token de login não encontrado" });
        setIsVerifying(false);
        return;
      }

      try {
        const result = await verifyLogin(login_token);

        if (result.success) {
          setStatus({ success: result.message });
          // Redireciona após verificação bem-sucedida
          setTimeout(() => {
            router.push("/dashboard"); // ou qualquer outra rota desejada
          }, 2000);
        } else {
          setStatus({ error: result.error });
        }
      } catch (error) {
        setStatus({ error: "Erro ao verificar login" });
      } finally {
        setIsVerifying(false);
      }
    }

    verify();
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Verificação de Login
        </h2>

        {isVerifying && (
          <div className="text-center text-gray-600">
            Verificando seu login...
          </div>
        )}

        {status.error && (
          <div className="text-red-500 mb-4 text-center">{status.error}</div>
        )}

        {status.success && (
          <div className="text-green-500 mb-4 text-center">
            {status.success}
            <p className="text-sm mt-2">Redirecionando para o dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
}
