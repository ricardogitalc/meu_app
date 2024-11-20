import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaExclamationTriangle } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4 gap-4">
          <FaExclamationTriangle
            className="text-yellow-500 text-4xl"
            aria-hidden="true"
          />
          <h1 className="text-4xl font-bold mr-4">404</h1>
        </div>
        <p className="text-xl mb-8">Page Not Found</p>
        <Button asChild>
          <Link href="/">Página inicial</Link>
        </Button>
      </div>
    </div>
  );
}
