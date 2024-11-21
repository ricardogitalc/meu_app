import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleButton } from "./google-button";
import { AuthLinks } from "./auth-links";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/auth/zod/schema";
import type { z } from "zod";
import { login } from "@/auth/api/api";
import { useState } from "react";
import { AlertMessage } from "@/components/ui/alert-message";

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setApiResponse(null);
      const response = await login({ destination: data.destination });
      setApiResponse({ message: response.message, type: "success" });
    } catch (error: any) {
      setApiResponse({
        message: error.message,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>
          Digite seu email para receber um link de acesso
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              {...register("destination")}
              placeholder="seu@email.com"
            />
            {errors.destination && (
              <AlertMessage
                type="error"
                message={errors.destination.message}
                variant="subtle"
              />
            )}
          </div>
          {apiResponse && (
            <AlertMessage
              type={apiResponse.type}
              message={apiResponse.message}
              variant="default"
            />
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Enviando..." : "Fazer login"}
          </Button>
          <GoogleButton />
          <AuthLinks type="login" />
        </CardFooter>
      </form>
    </Card>
  );
}
