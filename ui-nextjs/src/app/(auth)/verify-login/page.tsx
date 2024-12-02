"use client";

import { useSearchParams } from "next/navigation";

export default function VerifyLoginPage() {
  const searchParams = useSearchParams();
  const loginToken = searchParams.get("loginToken");
  console.log("loginToken:", loginToken);

  return <p>VerifyLoginPage</p>;
}
