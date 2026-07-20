"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function PricingPreviewSection() {
  const plans = [
    {
      name: "Free",
      price: "0",
      description: "Platformanı test etmək üçün ideal başlanğıc",
      features: ["20 Pulsuz Kredit", "Standart Keyfiyyət", "Şəkil Generasiyası", "İcma Dəstəyi"],
      buttonText: "Pulsuz Başla",
      buttonVariant: "outline" as const,
      popular: false,
    },
    {
      name: "Pro",
      price: "29",
      description: "Peşəkarlar və mütəmadi istifadəçilər üçün",
      features: ["1000 Kredit / ay", "Hyper-Realistic Keyfiyyət", "Video Generasiya", "Prioritet Dəstək", "Watermark yoxdur"],
      buttonText: "Pro Planını Seç",
      buttonVariant: "default" as const,
      popular: true,
    },
  ];

  return (
    <section className="w-full py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-indigo-500/5 dark:bg-indigo-500/10 skew-y-[-2deg] transform-gpu z-0" />
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Ehtiyacınıza uyğun planlar</h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Hər büdcəyə uyğun qiymət paketləri ilə yaradıcılığınızı məhdudlaşdırmayın. İstədiyiniz vaxt planı dəyişdirə bilərsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <div 
              key={i}
              className={`relative flex flex-col p-6 rounded-3xl bg-background border ${plan.popular ? 'border-indigo-500 shadow-2xl shadow-indigo-500/20 scale-100 md:scale-105 z-10' : 'border-border shadow-lg'}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-full">
                    Ən Çox Seçilən
                  </span>
                </div>
              )}
              
              <div className="space-y-1 mb-5">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
              
              <div className="mb-5 flex items-baseline text-4xl font-extrabold">
                ${plan.price}
                <span className="text-lg font-medium text-muted-foreground ml-1">/ay</span>
              </div>
              
              <ul className="space-y-3 mb-6 flex-1 text-sm">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                      <Check className="w-3 h-3 font-bold" />
                    </div>
                    <span className="text-zinc-700 dark:text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link 
                href="/sign-up" 
                className={buttonVariants({ variant: plan.buttonVariant, className: "w-full rounded-full h-10" })}
              >
                {plan.buttonText}
              </Link>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/pricing" className="text-indigo-500 hover:text-indigo-600 font-medium inline-flex items-center gap-1">
            Bütün planlara və kredit paketlərinə baxın →
          </Link>
        </div>
      </div>
    </section>
  );
}
