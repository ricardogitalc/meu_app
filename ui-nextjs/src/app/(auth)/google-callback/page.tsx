"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { serverLogin } from "@/auth/actions";

export default function CallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    async function handleCallback() {
      try {
        const token = searchParams.get("token");
        const refreshToken = searchParams.get("refreshToken");
        const userStr = searchParams.get("user");

        if (!token || !refreshToken) {
          router.push("/login");
          return;
        }

        const user = userStr ? JSON.parse(userStr) : null;
        await serverLogin(token, refreshToken, user);
        router.push("/");
      } catch (error) {
        router.push("/login");
      }
    }

    handleCallback();
  }, [searchParams, router]);

  return <Loading />;
}
