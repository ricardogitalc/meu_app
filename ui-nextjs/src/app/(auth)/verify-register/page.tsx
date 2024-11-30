"use client";
import { verifyRegister } from "@/auth/api/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FaCircleCheck, FaTriangleExclamation } from "react-icons/fa6";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "@/app/loading";
import { registerAction } from "./action";

type AlertType = {
  type: "error" | "success";
  message: string;
};

export default function VerifyRegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registerToken = searchParams.get("registerToken");
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function verificarRegistro() {
      if (registerToken) {
        try {
          await new Promise((resolve) => setTimeout(resolve, 1500));

          const response = await verifyRegister(registerToken);

          if (response.status === 401) {
            setAlert({
              type: "error",
              message: response.message || "Token de verificação inválido",
            });
          } else {
            const verifyResult = await registerAction(response);

            if (verifyResult.success) {
              setAlert({
                type: "success",
                message: response.message || "Conta verificada com sucesso!",
              });
              setTimeout(() => {
                router.push("/");
              }, 2000);
            } else {
              setAlert({
                type: "error",
                message: verifyResult.error || "Erro ao verificar conta",
              });
            }
          }
        } catch (error) {
          setAlert({
            type: "error",
            message: "Erro ao verificar registro",
          });
        } finally {
          setIsLoading(false);
        }
      }
    }

    verificarRegistro();
  }, [registerToken, router]);

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
