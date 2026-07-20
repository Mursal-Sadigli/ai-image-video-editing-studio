import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col items-center w-full bg-background min-h-screen py-16">
      <div className="container max-w-3xl px-4 md:px-6">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" /> Ana Səhifəyə Qayıt
        </Link>
        
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Məxfilik Siyasəti</h1>
          <p className="text-muted-foreground mb-8">Son yenilənmə tarixi: 20 İyul 2026</p>
          
          <div className="space-y-8 text-zinc-700 dark:text-zinc-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Məlumatlarınızı Necə Qoruyuruq?</h2>
              <p>
                VisionAI olaraq məxfiliyinizə böyük hörmətlə yanaşırıq. Sizin daxil etdiyiniz e-poçt ünvanı, profil məlumatları və generasiya etdiyiniz fayllar tamamilə təhlükəsiz şəkildə qorunur. Biz bu məlumatları heç bir üçüncü tərəf reklam şirkətlərinə satmırıq və ya paylaşmırıq.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Topladığımız Məlumatlar</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Hesab məlumatları:</strong> Adınız, e-poçt ünvanınız (Clerk vasitəsilə təmin olunur).</li>
                <li><strong>Ödəniş məlumatları:</strong> Biz kredit kartı məlumatlarınızı serverlərimizdə saxlamırıq. Bütün əməliyyatlar 100% təhlükəsiz olaraq Stripe tərəfindən icra olunur.</li>
                <li><strong>Məzmun:</strong> Yüklədiyiniz fotolar və ya yazdığınız mətnlər yalnız sizin xidmət sorğunuzu yerinə yetirmək (AI generasiyası) üçün istifadə olunur və ImageKit serverlərində etibarlı şəkildə saxlanılır.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Məlumatların Silinməsi</h2>
              <p>
                Hesabınızı sildiyiniz təqdirdə (və ya admin tərəfindən silindikdə) sizə aid olan bütün şəxsi məlumatlar, o cümlədən generasiya etdiyiniz vizuallar və loqlar sistemdən tamamilə silinir. Dərhal silinmə tələbi üçün dəstək komandamızla əlaqə saxlaya bilərsiniz.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
