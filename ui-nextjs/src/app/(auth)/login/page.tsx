"use client";

import { LoginForm } from "@/components/auth/login-form";
import { useSearchParams } from "next/navigation";

const errorMessages = {
  "token-invalido-ou-expirado":
    "O link de acesso expirou ou é inválido. Por favor, solicite um novo link.",
  "falha-autenticacao": "Houve um problema na autenticação. Tente novamente.",
};

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex flex-col justify-center items-center gap-10">
      {error && (
        <div>
          <div className="bg-red-50 border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-200/20 dark:text-red-400 border rounded-lg p-4 text-sm">
            {errorMessages[error as keyof typeof errorMessages] ||
              "Ocorreu um erro durante o login."}
          </div>
        </div>
      )}
      <LoginForm />
    </div>
  );
}
