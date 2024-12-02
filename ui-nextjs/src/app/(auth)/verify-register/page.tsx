"use client";

import { useSearchParams } from "next/navigation";

export default function VerifyRegisterPage() {
  const searchParams = useSearchParams();
  const registerToken = searchParams.get("registerToken");
  console.log("registerToken:", registerToken);

  return <p>VerifyRegisterPage</p>;
}
