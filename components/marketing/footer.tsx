import Link from "next/link";

import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-primary/10 p-1.5 rounded-lg group-hover:bg-primary/20 transition-colors flex items-center justify-center">
                <Sparkles className="h-5 w-5 animate-sparkle" />
              </div>
              <h3 className="text-lg font-bold">VisionAI</h3>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Hyper-realistic AI image & video generation studio.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Xüsusiyyətlər</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/features/image-generation" className="hover:text-primary transition-colors">Şəkil Generasiyası</Link></li>
              <li><Link href="/features/video-generation" className="hover:text-primary transition-colors">Video Generasiyası</Link></li>
              <li><Link href="/features/background-removal" className="hover:text-primary transition-colors">Arxa Fon Silinməsi</Link></li>
              <li><Link href="/features/upscaler" className="hover:text-primary transition-colors">Keyfiyyətin Artırılması</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Şirkət</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Qiymətlər</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Bloq</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">Haqqımızda</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Əlaqə</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Hüquqi</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/legal/terms" className="hover:text-primary transition-colors">İstifadə Şərtləri</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-primary transition-colors">Məxfilik Siyasəti</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} VisionAI. Bütün hüquqlar qorunur.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-primary transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-primary transition-colors">Instagram</Link>
            <Link href="#" className="hover:text-primary transition-colors">GitHub</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
