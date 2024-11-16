"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login Page</h2>
        <Input type="text" placeholder="Username" className="mb-4 w-full" />
        <Button className="w-full">Login</Button>
      </div>
    </div>
  );
}
