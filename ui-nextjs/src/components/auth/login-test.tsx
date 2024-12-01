import { getSession, login, logout } from "@/auth/session";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function LoginTesteComponent() {
  const session = await getSession();

  return (
    <div className="flex min-h-screen items-center justify-start p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            className="space-y-4"
            action={async (formData) => {
              "use server";
              await login(formData);
              redirect("/");
            }}
          >
            <Input
              type="email"
              placeholder="Digite seu email"
              className="w-full"
              name="email"
            />
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>

          <Separator className="my-4" />

          <form
            action={async () => {
              "use server";
              await logout();
              redirect("/");
            }}
          >
            <Button variant="outline" type="submit" className="w-full">
              Sair
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="w-full overflow-auto rounded-lg bg-muted p-4">
            <pre className="text-sm">{JSON.stringify(session, null, 2)}</pre>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
