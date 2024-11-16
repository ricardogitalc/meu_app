"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { verifyLogin } from "@/api/api";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<{ error?: string; success?: string }>(
    {}
  );

  useEffect(() => {
    async function verify() {
      const login_token = searchParams.get("login_token");

      if (!login_token) {
        setStatus({ error: "Token de login não encontrado" });
        return;
      }

      const result = await verifyLogin(login_token);
      setStatus({
        error: result.error,
        success: result.success ? result.message : undefined,
      });
    }

    verify();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Verificação de Login
        </h2>

        {status.error && (
          <div className="text-red-500 mb-4 text-center">{status.error}</div>
        )}

        {status.success && (
          <div className="text-green-500 mb-4 text-center">
            {status.success}
          </div>
        )}
      </div>
    </div>
  );
}
