"use client";

import { useState } from "react";
import { loginAction } from "@/auth/_actions/login-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginAction(email);

      toast({
        variant: result.success ? "success" : "destructive",
        title: result.success ? "Link enviado!" : "Erro",
        description: result.message,
      });

      if (result.success) {
        setEmail("");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao processar login",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>
          Digite seu email para receber um link de acesso
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Seu email</Label>
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
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
