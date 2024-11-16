"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { login } from "../../../api/api";

export default function LoginPage() {
  const [destination, setEmail] = useState("");
  const [status, setStatus] = useState<{ error?: string; success?: string }>(
    {}
  );

  const handleSubmit = async () => {
    setStatus({});
    const result = await login(destination);
    setStatus({
      error: result.error,
      success: result.success ? result.message : undefined,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login Page</h2>
        {status.error && (
          <div className="text-red-500 mb-4">{status.error}</div>
        )}
        {status.success && (
          <div className="text-green-500 mb-4">{status.success}</div>
        )}
        <Input
          type="email"
          placeholder="Digite seu email"
          className="mb-4 w-full"
          value={destination}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button className="w-full mb-4" onClick={handleSubmit}>
          Login
        </Button>
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <FcGoogle />
          Login with Google
        </Button>
      </div>
    </div>
  );
}
