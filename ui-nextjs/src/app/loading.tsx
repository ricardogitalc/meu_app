import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
