import ProfileForm from "@/components/auth/profile-form";
import { getSession } from "@/auth/lib";
import { redirect } from "next/navigation";

export default async function PerfilPage() {
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  return <ProfileForm user={user} />;
}
