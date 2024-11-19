import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function GoogleButton() {
  const [isLoading, setIsLoading] = useState(false);

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
