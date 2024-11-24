import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

export function GoogleButton() {
  const handleGoogleLogin = () => {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3003";
    window.location.href = `${backendUrl}/auth/google`;
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full flex items-center justify-center gap-2"
      onClick={handleGoogleLogin}
    >
      <FcGoogle />
      Continuar com Google
    </Button>
  );
}
