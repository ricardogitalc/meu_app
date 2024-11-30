"use client";
import { verifyLogin } from "@/auth/api/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FaCircleCheck, FaTriangleExclamation } from "react-icons/fa6";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "@/app/loading";
import { loginAction } from "./action";

type AlertType = {
  type: "error" | "success";
  message: string;
};

export default function VerifyLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginToken = searchParams.get("loginToken");
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function verificarLogin() {
      if (loginToken) {
        try {
          await new Promise((resolve) => setTimeout(resolve, 1500));

          const response = await verifyLogin(loginToken);
          console.log("Resposta da API:", response);

          if (response.status === 401) {
            setAlert({
              type: "error",
              message: response.message || "Token de verificação inválido",
            });
          } else {
            const loginResult = await loginAction(response);

            if (loginResult.success) {
              setAlert({
                type: "success",
                message: response.message || "Login verificado com sucesso!",
              });
              setTimeout(() => {
                router.push("/");
              }, 2000);
            } else {
              setAlert({
                type: "error",
                message: loginResult.error || "Erro ao fazer login",
              });
            }
          }
        } catch (error) {
          setAlert({
            type: "error",
            message: "Erro ao verificar login",
          });
        } finally {
          setIsLoading(false);
        }
      }
    }

    verificarLogin();
  }, [loginToken, router]);

  return (
    <div className="flex min-h-screen items-start justify-center p-4">
      {isLoading ? (
        <Loading />
      ) : (
        alert && (
          <Alert
            variant={alert.type === "error" ? "destructive" : "success"}
            className="max-w-md flex items-center p-6"
          >
            <div className="flex justify-center items-center gap-4">
              <div>
                {alert.type === "error" ? (
                  <FaTriangleExclamation className="h-8 w-8" />
                ) : (
                  <FaCircleCheck className="h-8 w-8" />
                )}
              </div>
              <AlertDescription className="text-center text-lg font-medium">
                {alert.message}
              </AlertDescription>
            </div>
          </Alert>
        )
      )}
    </div>
  );
}
