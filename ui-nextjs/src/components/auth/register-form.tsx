"use client";

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
import { AuthLinks } from "./auth-links";
import { GoogleButton } from "./google-button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormOutput } from "@/auth/schema/schema";
import type { z } from "zod";
import { AlertMessage } from "@/components/ui/alert-message";
import { registerUser } from "@/auth/api/api";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      const outputData: RegisterFormOutput = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        whatsappNumber: data.whatsappNumber,
      };

      const response = await registerUser(outputData);

      // Adiciona delay de 2 segundos
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Verifica se a resposta contém status de erro
      if (response.status === 401) {
        toast({
          title: "Erro",
          description: response.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso!",
        description: response.message,
        variant: "success",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.response?.message || "Erro ao criar conta",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Criar Conta</CardTitle>
        <CardDescription>Registre-se para acessar a plataforma</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="firstName">Nome</Label>
              <Input {...register("firstName")} placeholder="Digite seu nome" />
              {errors.firstName && (
                <AlertMessage
                  type="error"
                  message={errors.firstName.message}
                  variant="subtle"
                />
              )}
            </div>
            <div className="space-y-2 flex-1">
              <Label htmlFor="lastName">Sobrenome</Label>
              <Input
                {...register("lastName")}
                placeholder="Digite seu sobrenome"
              />
              {errors.lastName && (
                <AlertMessage
                  type="error"
                  message={errors.lastName.message}
                  variant="subtle"
                />
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              {...register("email")}
              placeholder="Digite seu email"
            />
            {errors.email && (
              <AlertMessage
                type="error"
                message={errors.email.message}
                variant="subtle"
              />
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmEmail">Confirmar Email</Label>
            <Input
              type="email"
              {...register("confirmEmail")}
              placeholder="Confirme seu email"
            />
            {errors.confirmEmail && (
              <AlertMessage
                type="error"
                message={errors.confirmEmail.message}
                variant="subtle"
              />
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsappNumber">WhatsApp</Label>
            <Input
              {...register("whatsappNumber")}
              placeholder="Ex: 11999999999"
              type="tel"
              maxLength={11}
            />
            {errors.whatsappNumber && (
              <AlertMessage
                type="error"
                message={errors.whatsappNumber.message}
                variant="subtle"
              />
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando conta...
              </>
            ) : (
              "Criar conta"
            )}
          </Button>
          <GoogleButton />
          <AuthLinks type="register" />
        </CardFooter>
      </form>
    </Card>
  );
}
