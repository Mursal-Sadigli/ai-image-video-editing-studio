import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Image as ImageIcon, Film, Eraser, ZoomIn, Wand2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

const toolsData = {
  "image-generation": {
    name: "AI Şəkil Generasiyası",
    icon: ImageIcon,
    desc: "Yalnız bir mətn (prompt) yazaraq xəyalınızdakı fotoları gerçəkləşdirin. VisionAI-nin alqoritmləri sayəsində əldə etdiyiniz şəkillər adi AI alətlərindən fərqli olaraq tamamilə real foto kimidir.",
    color: "from-blue-500 to-indigo-500",
    features: [
      "Photorealistic tekstura və işıqlandırma",
      "Saniyələr içində 4 fərqli variant",
      "İstənilən aspekt nisbətini (16:9, 9:16, 1:1) dəstəkləyir",
      "Kommersiya məqsədləri üçün tam lisenziya"
    ]
  },
  "video-generation": {
    name: "AI Video Generasiyası",
    icon: Film,
    desc: "Mətn və ya şəkildən kinematik videolar yaradın. Stok videolar axtarmağa son. Məhsul tanıtımları, sosial media və B-roll üçün ideal həll.",
    color: "from-purple-500 to-pink-500",
    features: [
      "Yüksək axıcılıq (Smooth motion)",
      "Mövzuya uyğun kamera hərəkətləri",
      "Məhsul detallarının qorunması",
      "Sürətli render (Asinxron emal)"
    ]
  },
  "background-removal": {
    name: "Arxa Fon Silinməsi",
    icon: Eraser,
    desc: "Mürəkkəb fonları belə bir toxunuşla mükəmməl şəkildə silin. Saç telləri, yarımşəffaf obyektlər və ya çətin kənarlar VisionAI üçün problem deyil.",
    color: "from-orange-500 to-red-500",
    features: [
      "Piksellərə qədər dəqiq kəsim",
      "Şəffaf (PNG) və ya rəngli fon imkanı",
      "E-commerce məhsulları üçün ideal",
      "Toplu (Bulk) emal imkanı"
    ]
  },
  "image-to-image": {
    name: "Image-to-Image",
    icon: Wand2,
    desc: "Mövcud şəklinizi referans olaraq istifadə edin və onu istədiyiniz stilə, mühitə və ya formata uyğunlaşdırın. Orijinal kompozisiyanı itirmədən yepyeni bir əsər yaradın.",
    color: "from-green-500 to-emerald-500",
    features: [
      "Orijinal toxumanın və duruşun qorunması",
      "Eskizlərin real fotolara çevrilməsi",
      "Otaq və mühit dizaynlarının dəyişdirilməsi",
      "Stil transferi (Karton, 3D, Fotorealizm)"
    ]
  },
  "upscaler": {
    name: "AI Upscaler",
    icon: ZoomIn,
    desc: "Aşağı keyfiyyətli, bulanıq və ya köhnə şəkillərinizi bərpa edin. Süni intellekt çatışmayan pikselləri məntiqi olaraq bərpa edir və 4x-ə qədər böyüdür.",
    color: "from-cyan-500 to-blue-500",
    features: [
      "Üz detallarının xüsusi bərpası (Face Enhance)",
      "Təbii dəri teksturasının əlavə edilməsi",
      "Mətnlərin və loqoların aydınlaşdırılması",
      "Çap üçün ideal yüksək rezolyusiya"
    ]
  },
  "object-removal": {
    name: "Obyekt Silinməsi",
    icon: Eraser,
    desc: "Fotodakı istənməyən adamları, obyektləri və ya qüsurları silin. Boşalan yer süni intellekt tərəfindən kənarlara uyğun olaraq qüsursuz şəkildə doldurulacaq.",
    color: "from-rose-500 to-pink-500",
    features: [
      "Ağıllı doldurma (Smart Fill)",
      "Mürəkkəb arxa fonların bərpası",
      "Fırça (Brush) ölçüsünün tənzimlənməsi",
      "Ləkələrin və qırışların silinməsi üçün ideal"
    ]
  }
};

type ToolKey = keyof typeof toolsData;

export default function FeaturePage({ params }: { params: { tool: string } }) {
  const toolId = params.tool as ToolKey;
  const tool = toolsData[toolId];

  if (!tool) {
    notFound();
  }

  const Icon = tool.icon;

  return (
    <div className="flex flex-col items-center w-full min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <section className="w-full pt-20 pb-16 md:pt-32 md:pb-24 bg-background relative overflow-hidden">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gradient-to-b ${tool.color} opacity-10 dark:opacity-20 blur-3xl pointer-events-none rounded-b-full`} />
        
        <div className="container relative z-10 px-4 md:px-6 max-w-4xl mx-auto flex flex-col items-center text-center space-y-6">
          <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 mb-4`}>
            <Icon className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            {tool.name}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {tool.desc}
          </p>
          
          <div className="pt-8">
            <Link href="/sign-up" className={buttonVariants({ size: "lg", className: "h-14 px-8 rounded-full text-lg" })}>
              Pulsuz Sınayın <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Xüsusiyyətlər siyahısı */}
      <section className="w-full py-16 bg-zinc-50 dark:bg-zinc-900/50 border-y flex-1">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          <div className="bg-background rounded-3xl p-8 md:p-12 border shadow-sm">
            <h2 className="text-2xl font-bold mb-8 text-center">Niyə bizim {tool.name.toLowerCase()} alətimiz fərqlidir?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tool.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`w-10 h-10 shrink-0 rounded-full bg-gradient-to-br ${tool.color} bg-opacity-10 flex items-center justify-center text-white mt-1 shadow-md`}>
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{feature}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
