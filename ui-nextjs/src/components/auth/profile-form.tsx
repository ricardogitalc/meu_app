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
import { profileSchema } from "@/auth/schema/schema";
import type { z } from "zod";
import type { User } from "@/types/user";
import { updateUser } from "@/auth/api/api";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

type ProfileFormData = z.infer<typeof profileSchema>;

type ProfileFormProps = {
  user: User;
};

export default function ProfileForm({ user }: ProfileFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      whatsappNumber: user.whatsappNumber,
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);
      const result = await updateUser(user.id, data);

      // Adiciona delay de 2 segundos
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (!result.success) {
        toast({
          title: "Erro",
          description: result.message || "Não foi possível atualizar o perfil",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso!",
        description: "Perfil atualizado com sucesso!",
        variant: "success",
      });

      // Reseta o formulário com os novos valores
      reset(data);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao conectar com o servidor",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
            <Input
              id="email"
              type="email"
              disabled
              className="bg-muted"
              value={user.email}
            />
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
          <Button
            className="w-full"
            type="submit"
            disabled={isLoading || !isDirty}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Atualizando...
              </>
            ) : (
              "Atualizar perfil"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
