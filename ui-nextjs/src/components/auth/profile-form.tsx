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

export default function ProfileForm() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Perfil</CardTitle>
        <CardDescription>Atualize suas informações pessoais</CardDescription>
      </CardHeader>
      <form>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" disabled className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="firstName">Nome</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="Nome"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Sobrenome</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Sobrenome"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              name="whatsapp"
              placeholder="WhatsApp (apenas números)"
              pattern="\d*"
              title="Digite apenas números"
            />
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
