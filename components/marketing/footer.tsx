import Link from "next/link";

import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-primary/10 p-1.5 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Sparkles className="h-5 w-5 text-primary animate-sparkle" />
              </div>
              <h3 className="text-lg font-bold">VisionAI</h3>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Hyper-realistic AI image & video generation studio.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-4">Məhsul</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/features" className="hover:text-primary">Xüsusiyyətlər</Link></li>
              <li><Link href="/pricing" className="hover:text-primary">Qiymətlər</Link></li>
              <li><Link href="/use-cases" className="hover:text-primary">İstifadə Halları</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Resurslar</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/blog" className="hover:text-primary">Bloq</Link></li>
              <li><Link href="/changelog" className="hover:text-primary">Yeniliklər</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Əlaqə</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Hüquqi</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/legal/terms" className="hover:text-primary">Şərtlər</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-primary">Məxfilik</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} VisionAI Studio. Bütün hüquqlar qorunur.
        </div>
      </div>
    </footer>
  );
}
