import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
        <FileQuestion className="w-10 h-10" />
      </div>
      <h1 className="text-6xl font-black tracking-tighter mb-2">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Səhifə Tapılmadı</h2>
      <p className="text-muted-foreground text-lg max-w-md mb-8">
        Axtardığınız səhifə mövcud deyil və ya ünvanı dəyişdirilib. Zəhmət olmasa URL-i yoxlayın və ya ana səhifəyə qayıdın.
      </p>
      <Link href="/" className={buttonVariants({ variant: "default", size: "lg" })}>
        Ana Səhifəyə Qayıt
      </Link>
    </div>
  );
}
