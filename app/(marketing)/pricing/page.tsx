"use client";

import Link from "next/link";
import { Check, Info } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { FaqSection } from "@/components/marketing/faq";
import { motion } from "framer-motion";

export default function PricingPage() {
  const subscriptions = [
    {
      name: "Free",
      price: "0",
      description: "Platformanı test etmək üçün ideal başlanğıc",
      features: [
        "20 Pulsuz Kredit",
        "Standart Keyfiyyət",
        "Şəkil Generasiyası",
        "Arxa Fon Silinməsi",
        "İcma Dəstəyi"
      ],
      buttonText: "İndi Başla",
      buttonVariant: "outline" as const,
      popular: false,
    },
    {
      name: "Pro",
      price: "29",
      description: "Peşəkarlar və mütəmadi istifadəçilər üçün",
      features: [
        "1000 Kredit / ay",
        "Hyper-Realistic Keyfiyyət",
        "Video Generasiya və Redaktə",
        "Komanda İş Sahəsi (Team)",
        "Watermark yoxdur",
        "Prioritet Dəstək"
      ],
      buttonText: "Pro Planını Seç",
      buttonVariant: "default" as const,
      popular: true,
    },
    {
      name: "Business",
      price: "99",
      description: "Agentliklər və böyük komandalar üçün limitsiz güc",
      features: [
        "5000 Kredit / ay",
        "Bütün Pro xüsusiyyətləri",
        "Limitsiz komanda üzvü",
        "Özəl API çıxışı",
        "Xüsusi təlim",
        "24/7 VIP Dəstək"
      ],
      buttonText: "Biznes Planını Seç",
      buttonVariant: "outline" as const,
      popular: false,
    },
  ];

  const creditPacks = [
    { credits: 500, price: 15, name: "Kiçik Paket" },
    { credits: 2000, price: 45, name: "Orta Paket", popular: true },
    { credits: 5000, price: 90, name: "Böyük Paket" },
  ];

  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full pt-32 pb-16 md:pt-40 md:pb-24 bg-background relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="container relative z-10 px-4 md:px-6 max-w-3xl mx-auto space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight"
          >
            Sadə və şəffaf qiymətləndirmə
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground"
          >
            Sürpriz ödənişlər yoxdur. Ehtiyacınıza uyğun planı seçin və ya sadəcə istifadə etdiyiniz qədər kredit alın.
          </motion.p>
        </div>
      </section>

      {/* Subscriptions */}
      <section className="w-full pb-24 container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {subscriptions.map((plan, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.2 }}
              key={i}
              className={`relative flex flex-col p-8 rounded-3xl bg-background border ${plan.popular ? 'border-indigo-500 shadow-2xl shadow-indigo-500/20 md:-translate-y-4 z-10' : 'border-border shadow-lg'}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-indigo-500 text-white text-xs font-bold px-4 py-1.5 uppercase tracking-wider rounded-full shadow-md">
                    Ən Çox Seçilən
                  </span>
                </div>
              )}
              
              <div className="space-y-2 mb-6 text-center">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-muted-foreground text-sm h-10">{plan.description}</p>
              </div>
              
              <div className="mb-6 flex justify-center items-baseline text-5xl font-extrabold">
                ${plan.price}
                <span className="text-xl font-medium text-muted-foreground ml-2">/ay</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 shrink-0 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                      <Check className="w-3 h-3 font-bold" />
                    </div>
                    <span className="text-zinc-700 dark:text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link 
                href="/sign-up" 
                className={buttonVariants({ variant: plan.buttonVariant, size: "lg", className: "w-full rounded-full h-12" })}
              >
                {plan.buttonText}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Credit Packs */}
      <section className="w-full py-24 bg-zinc-50 dark:bg-zinc-900/50 border-y">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Kredit Paketləri (Pay As You Go)</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Aylıq abunəlik istəmirsiniz? Yalnız ehtiyacınız olduqda kredit satın alın. Kreditlərin son istifadə tarixi yoxdur.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {creditPacks.map((pack, i) => (
              <div key={i} className={`bg-background rounded-2xl p-6 text-center border shadow-sm transition-all hover:shadow-md ${pack.popular ? 'border-indigo-400 ring-1 ring-indigo-400/50' : ''}`}>
                <div className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">{pack.name}</div>
                <div className="text-4xl font-black text-indigo-500 mb-2">{pack.credits} <span className="text-2xl text-foreground font-bold">Kredit</span></div>
                <div className="text-2xl font-semibold mb-6">${pack.price}</div>
                <Link href="/sign-up" className={buttonVariants({ variant: pack.popular ? "default" : "secondary", className: "w-full rounded-full" })}>
                  Paketi Al
                </Link>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex items-start sm:items-center justify-center gap-2 text-sm text-muted-foreground max-w-2xl mx-auto text-left sm:text-center p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-700 dark:text-blue-400">
            <Info className="w-5 h-5 shrink-0" />
            <p>1 Kredit = 1 Şəkil generasiyası. Video və mürəkkəb əməliyyatlar 3-5 kredit tələb edə bilər.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection />
    </div>
  );
}
