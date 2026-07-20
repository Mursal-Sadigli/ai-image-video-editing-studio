"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Sentry və ya digər loggerlərə xətanı göndərmək
    console.error("Qlobal Xəta Tutaç tərəfindən tutuldu:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-4">Gözlənilməz Xəta</h1>
      <p className="text-muted-foreground text-lg max-w-md mb-8">
        Sistemdə gözlənilməz bir xəta baş verdi. Zəhmət olmasa səhifəni yeniləyin və ya ana səhifəyə qayıdın. Problem davam edərsə, dəstək komandası ilə əlaqə saxlayın.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Yenidən Cəhd Et
        </button>
        <Link href="/" className={buttonVariants({ variant: "default", size: "lg" })}>
          Ana Səhifəyə Qayıt
        </Link>
      </div>
    </div>
  );
}
