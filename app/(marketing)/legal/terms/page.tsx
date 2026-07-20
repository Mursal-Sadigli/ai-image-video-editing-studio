import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col items-center w-full bg-background min-h-screen py-16">
      <div className="container max-w-3xl px-4 md:px-6">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" /> Ana Səhifəyə Qayıt
        </Link>
        
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">İstifadə Şərtləri</h1>
          <p className="text-muted-foreground mb-8">Son yenilənmə tarixi: 20 İyul 2026</p>
          
          <div className="space-y-8 text-zinc-700 dark:text-zinc-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Xidmətin Qəbulu</h2>
              <p>
                VisionAI ("biz", "bizi" və ya "bizim") xidmətlərinə giriş edərək və ya onlardan istifadə edərək, bu İstifadə Şərtləri ("Şərtlər") ilə razılaşdığınızı təsdiq edirsiniz. Əgər bu şərtlərlə razılaşmırsınızsa, lütfən xidmətlərimizdən istifadə etməyin.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. İstifadəçi Hesabları</h2>
              <p>
                Platformanın bəzi xüsusiyyətlərindən istifadə etmək üçün hesab yaratmalısınız. Hesabınızın və şifrənizin təhlükəsizliyinə görə siz məsuliyyət daşıyırsınız. Biz hesab məlumatlarınızı (Google/Clerk vasitəsilə) məxfi saxlayır və üçüncü tərəflərlə reklam məqsədilə paylaşmırıq.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Müəllif Hüquqları (Copyright)</h2>
              <p>
                Pulsuz ("Free") plan istisna olmaqla, bütün pullu abunəliklər ("Pro", "Business") çərçivəsində yaratdığınız vizual məzmunlar (şəkillər və videolar) tamamilə sizin kommersiya mülkiyyətiniz sayılır. Onları sərbəst şəkildə sata, dəyişdirə və yayımlaya bilərsiniz.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Qadağan Olunmuş İstifadələr</h2>
              <p>
                Platformamızdan qeyri-qanuni, zorakılıq təbliğ edən, uşaq istismarı ehtiva edən və ya başqalarının hüquqlarını pozan hər hansı məzmun yaratmaq üçün istifadə edilməsi qəti qadağandır. Biz qaydaları pozan hesabları dərhal bloklamaq hüququnu özümüzdə saxlayırıq.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Geri Ödəmə (Refund) Siyasəti</h2>
              <p>
                Aylıq abunəliklər üçün pulun geri qaytarılması nəzərdə tutulmur. Planınızı istədiyiniz vaxt ləğv edə bilərsiniz və ödədiyiniz ayın sonuna qədər xidmətdən tam istifadə hüququnuz qalacaq. Kredit paketləri də istifadə olunub-olunmamasından asılı olmayaraq geri qaytarılmır.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
