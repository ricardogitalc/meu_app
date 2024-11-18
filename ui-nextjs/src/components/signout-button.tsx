import { LogOutIcon } from "lucide-react";
import { signOut } from "../auth";
import { DropdownMenuItem } from "./ui/dropdown-menu";

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <DropdownMenuItem asChild>
        <button className="w-full text-left" type="submit">
          <LogOutIcon />
          Sair
        </button>
      </DropdownMenuItem>
    </form>
  );
}
