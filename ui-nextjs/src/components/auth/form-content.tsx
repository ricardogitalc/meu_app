"use client";

import { AlertMessage } from "@/components/ui/alert-message";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormContentProps {
  fieldErrors: Record<string, string>;
  user: {
    email: string;
    firstName?: string;
    lastName?: string;
    whatsappNumber?: string;
  };
}

export function FormContent({ fieldErrors, user }: FormContentProps) {
  return (
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
        <Input
          name="firstName"
          defaultValue={user.firstName}
          placeholder="Nome"
        />
        {fieldErrors.firstName && (
          <AlertMessage
            type="error"
            message={fieldErrors.firstName}
            variant="subtle"
          />
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Sobrenome</Label>
        <Input
          name="lastName"
          defaultValue={user.lastName}
          placeholder="Sobrenome"
        />
        {fieldErrors.lastName && (
          <AlertMessage
            type="error"
            message={fieldErrors.lastName}
            variant="subtle"
          />
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="whatsapp">WhatsApp</Label>
        <Input
          name="whatsappNumber"
          defaultValue={user.whatsappNumber}
          placeholder="Ex: 11999999999"
          type="tel"
          maxLength={11}
        />
        {fieldErrors.whatsappNumber && (
          <AlertMessage
            type="error"
            message={fieldErrors.whatsappNumber}
            variant="subtle"
          />
        )}
      </div>
    </CardContent>
  );
}
