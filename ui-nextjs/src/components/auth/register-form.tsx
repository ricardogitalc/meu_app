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

export function RegisterForm() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Criar Conta</CardTitle>
        <CardDescription>Registre-se para acessar a plataforma</CardDescription>
      </CardHeader>
      <form>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <div className="space-y-2 flex-1">
              <Label>Nome</Label>
              <Input placeholder="Digite seu nome" />
            </div>
            <div className="space-y-2 flex-1">
              <Label>Sobrenome</Label>
              <Input placeholder="Digite seu sobrenome" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" placeholder="Digite seu email" />
          </div>
          <div className="space-y-2">
            <Label>Confirmar email</Label>
            <Input type="email" placeholder="Confirme seu email" />
          </div>
          <div className="space-y-2">
            <Label>WhatsApp</Label>
            <Input placeholder="Ex: 11999999999" type="tel" />
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
