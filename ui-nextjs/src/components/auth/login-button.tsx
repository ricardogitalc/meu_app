import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { handleLogin } from "@/hooks/useLogin";

export default function LoginButton() {
  return (
    <form className="space-y-4" action={handleLogin}>
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
  );
}
