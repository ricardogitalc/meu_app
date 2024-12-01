import { getSession } from "@/auth/session";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import LogoutButton from "./logout-button";
import LoginButton from "./login-button";

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
          <LoginButton />
          <Separator className="my-4" />
          <LogoutButton />
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
