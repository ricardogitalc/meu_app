"use client";
import { useSearchParams } from "next/navigation";

export default function VerifyRegisterPage() {
  const searchParams = useSearchParams();
  const register_token = searchParams.get("register_token");

  console.log(register_token);

  return (
    <div>
      <h1>Verify Register</h1>
    </div>
  );
}
