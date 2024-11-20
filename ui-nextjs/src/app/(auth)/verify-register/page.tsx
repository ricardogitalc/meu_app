"use client";
import { useSearchParams } from "next/navigation";

export default function VerifyRegisterPage() {
  const searchParams = useSearchParams();
  const registerToken = searchParams.get("register_token");

  console.log(registerToken);

  return (
    <div>
      <h1>Verify Register</h1>
    </div>
  );
}
