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
import { loginSchema } from "@/auth/schema/schema";
import type { z } from "zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { sendMagicLink } from "@/auth/api/api";
import { AlertMessage } from "../ui/alert-message";
import { Loader2 } from "lucide-react";

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const response = await sendMagicLink(data.destination);

      await new Promise((resolve) => setTimeout(resolve, 2000));

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
        description: error.message || "Erro ao enviar link de acesso",
        variant: "destructive",
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
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Fazer login"
            )}
          </Button>
          <GoogleButton />
          <AuthLinks type="login" />
        </CardFooter>
      </form>
    </Card>
  );
}
