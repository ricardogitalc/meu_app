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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@/schemas/auth";
import type { z } from "zod";

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const onSubmit = (data: ProfileFormData) => {
    console.log("Dados do perfil:", data);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Perfil</CardTitle>
        <CardDescription>Atualize suas informações pessoais</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" disabled className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="firstName">Nome</Label>
            <Input {...register("firstName")} placeholder="Nome" />
            {errors.firstName && (
              <span className="text-sm text-red-500">
                {errors.firstName.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Sobrenome</Label>
            <Input {...register("lastName")} placeholder="Sobrenome" />
            {errors.lastName && (
              <span className="text-sm text-red-500">
                {errors.lastName.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
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
        <CardFooter>
          <Button className="w-full" type="submit">
            Atualizar perfil
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
