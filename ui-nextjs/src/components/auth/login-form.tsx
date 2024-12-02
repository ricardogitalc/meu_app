"use client";

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
import { Loader2 } from "lucide-react";

export function LoginForm() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>
          Digite seu email para receber um link de acesso
        </CardDescription>
      </CardHeader>
      <form>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Seu email</Label>
            <Input type="email" placeholder="seu@email.com" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" type="submit">
            Fazer login
          </Button>
          <GoogleButton />
          <AuthLinks type="login" />
        </CardFooter>
      </form>
    </Card>
  );
}
