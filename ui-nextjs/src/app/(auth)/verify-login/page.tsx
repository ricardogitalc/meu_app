"use client";
import { useSearchParams } from "next/navigation";

export default function VerifyLoginPage() {
  const searchParams = useSearchParams();
  const loginToken = searchParams.get("login_token");

  console.log(loginToken);

  return (
    <div>
      <h1>Verify Login</h1>
    </div>
  );
}
