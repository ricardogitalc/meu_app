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
import { ZodError } from "zod";
import { FormContent } from "./form-content";

interface FormState {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
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

      try {
        const validatedData = profileSchema.parse(data);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const result = await updateUser(user.id, validatedData);

        if (!result.success) {
          return {
            error: result.message || "Não foi possível atualizar o perfil",
          };
        }

        revalidatePath("/perfil");
        return { success: true };
      } catch (zodError) {
        if (zodError instanceof ZodError) {
          const fieldErrors: Record<string, string> = {};
          zodError.errors.forEach((error) => {
            if (error.path) {
              fieldErrors[error.path[0]] = error.message;
            }
          });
          return {
            error: "Erro de validação",
            fieldErrors,
          };
        }
        throw zodError; // Re-throw se não for um erro do Zod
      }
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
        <FormContent user={user} fieldErrors={{}} />
      </FormStateHandler>
    </Card>
  );
}
