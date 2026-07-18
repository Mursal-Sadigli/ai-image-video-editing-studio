import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export async function Navbar() {
  const { userId } = await auth();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between w-full relative">
        {/* Sol Tərəf: Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-primary/10 p-1.5 rounded-lg group-hover:bg-primary/20 transition-colors flex items-center justify-center">
              <Sparkles className="h-5 w-5 animate-sparkle" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-500 bg-clip-text text-transparent dark:from-white dark:to-zinc-400">
              VisionAI
            </span>
          </Link>
        </div>

        {/* Mərkəz: Naviqasiya linkləri */}
        <nav className="hidden md:flex gap-6 absolute left-1/2 -translate-x-1/2">
          <Link
            href="/features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Xüsusiyyətlər
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Qiymətlər
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Bloq
          </Link>
        </nav>
        <div className="flex items-center gap-6">
          {!userId ? (
            <>
              <Link href="/sign-in" className="text-sm font-medium hidden md:block hover:text-primary transition-colors">
                Giriş
              </Link>
              <Link href="/sign-up" className={buttonVariants({ variant: "default" })}>
                Pulsuz başla
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className={buttonVariants({ variant: "outline" })}>
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
