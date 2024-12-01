"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "@/components/ui/label";

export default function ProfileForm() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Atualizar perfil</CardTitle>
        <CardDescription>Atualize informações da sua conta</CardDescription>
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
            <Label>WhatsApp</Label>
            <Input placeholder="Ex: 11999999999" type="tel" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" type="submit">
            Atualizar perfil
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
