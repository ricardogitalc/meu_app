import { logoutSession } from "@/auth/session";
import { redirect } from "next/navigation";

export async function handleLogout() {
  "use server";
  await logoutSession();
  redirect("/");
}
