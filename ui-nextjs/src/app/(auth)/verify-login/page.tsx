"use client";

import { useSearchParams } from "next/navigation";
import { verifyLoginAction } from "@/auth/api/auth/auth-server-actions";
import { useEffect, useState } from "react";

export default function VerifyLoginPage() {
  const searchParams = useSearchParams();
  const loginToken = searchParams.get("loginToken");
  const [isLoading, setIsLoading] = useState(true);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  useEffect(() => {
    async function verifyToken() {
      if (loginToken) {
        try {
          const result = await verifyLoginAction(loginToken);
          setVerificationResult(result);
        } catch (error) {
          setVerificationResult({ error: "Falha na verificação" });
        }
        setIsLoading(false);
      }
    }
    verifyToken();
  }, [loginToken]);

  if (isLoading) return <p>Verificando...</p>;

  return (
    <div>
      <h1>Verificação de Login</h1>
      <pre>{JSON.stringify(verificationResult, null, 2)}</pre>
    </div>
  );
}
