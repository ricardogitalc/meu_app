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
import { registerSchema, type RegisterFormOutput } from "@/schemas/auth";
import type { z } from "zod";

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    // Removendo confirmEmail dos dados antes de enviar
    const outputData: RegisterFormOutput = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      whatsappNumber: data.whatsappNumber,
    };
    console.log("Dados do registro:", outputData);
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
                <span className="text-sm text-red-500">
                  {errors.firstName.message}
                </span>
              )}
            </div>
            <div className="space-y-2 flex-1">
              <Label htmlFor="lastName">Sobrenome</Label>
              <Input
                {...register("lastName")}
                placeholder="Digite seu sobrenome"
              />
              {errors.lastName && (
                <span className="text-sm text-red-500">
                  {errors.lastName.message}
                </span>
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
              <span className="text-sm text-red-500">
                {errors.email.message}
              </span>
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
              <span className="text-sm text-red-500">
                {errors.confirmEmail.message}
              </span>
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
              <span className="text-sm text-red-500">
                {errors.whatsappNumber.message}
              </span>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" type="submit">
            Criar conta
          </Button>
          <GoogleButton />
          <AuthLinks type="register" />
        </CardFooter>
      </form>
    </Card>
  );
}
