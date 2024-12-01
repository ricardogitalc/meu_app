import { loginSession } from "@/auth/session";
import { redirect } from "next/navigation";

export async function handleLogin(formData: FormData) {
  "use server";
  await loginSession(formData);
  redirect("/login-test");
}
