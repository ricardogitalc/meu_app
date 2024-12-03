"use client";

import { useSearchParams } from "next/navigation";

export default function VerifyRegisterPage() {
  const searchParams = useSearchParams();
  const registerToken = searchParams.get("registerToken");

  console.log("registerToken:", registerToken);

  return (
    <div>
      <h1>Verificação de Registro</h1>
    </div>
  );
}
