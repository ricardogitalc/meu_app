"use client";
import { useSearchParams } from "next/navigation";

export default function VerifyLoginPage() {
  const searchParams = useSearchParams();
  const login_token = searchParams.get("login_token");

  console.log(login_token);

  return (
    <div>
      <h1>Verify Login</h1>
    </div>
  );
}
