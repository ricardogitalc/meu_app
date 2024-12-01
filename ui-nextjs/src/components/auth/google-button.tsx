import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

export function GoogleButton() {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full flex items-center justify-center gap-2"
    >
      <FcGoogle />
      Continuar com Google
    </Button>
  );
}
