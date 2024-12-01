import { Button } from "../ui/button";
import { LogOutIcon } from "lucide-react";
import { handleLogout } from "@/hooks/useLogout";

export default function LogoutButton() {
  return (
    <form action={handleLogout}>
      <Button type="submit" variant="outline" className="w-full">
        <LogOutIcon className="w-4 h-4" />
        Sair
      </Button>
    </form>
  );
}
