import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSession } from "@/auth/lib";
import { profileSchema } from "@/auth/schema/schema";
import { revalidatePath } from "next/cache";
import { updateUser } from "@/auth/api/api";
import { FormStateHandler } from "./profile-form-wrapper";
import { redirect } from "next/navigation";
import { User } from "@/auth/interfaces/interfaces";

interface FormState {
  success?: boolean;
  error?: string;
}

type FormStateWithNull = FormState | null;

function assertUser(user: User | null): asserts user is User {
  if (!user) redirect("/login");
}

export default async function ProfileForm() {
  const userResponse = await getSession();
  assertUser(userResponse);

  const user: User = userResponse;

  const initialValues: Record<string, string | undefined> = {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    whatsappNumber: user.whatsappNumber,
  };

  async function updateProfile(
    prevState: FormStateWithNull,
    formData: FormData
  ): Promise<FormState> {
    "use server";

    try {
      const data = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        whatsappNumber: formData.get("whatsappNumber") as string,
      };

      const validatedData = profileSchema.parse(data);
      const result = await updateUser(user.id, validatedData);

      if (!result.success) {
        return {
          error: result.message || "Não foi possível atualizar o perfil",
        };
      }

      revalidatePath("/perfil");
      return { success: true };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Erro ao validar dados",
      };
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Perfil</CardTitle>
        <CardDescription>Atualize suas informações pessoais</CardDescription>
      </CardHeader>
      <FormStateHandler action={updateProfile} initialValues={initialValues}>
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
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Sobrenome</Label>
            <Input
              name="lastName"
              defaultValue={user.lastName}
              placeholder="Sobrenome"
            />
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
          </div>
        </CardContent>
      </FormStateHandler>
    </Card>
  );
}
