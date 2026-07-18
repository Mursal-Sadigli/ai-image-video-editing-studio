"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLANS, CREDIT_PACKS } from "@/config/pricing";
import { motion } from "framer-motion";

export default function PricingPage() {
  const plansList = Object.values(PLANS);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32 w-full">
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">Sadə və şəffaf qiymətlər</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Ehtiyacınıza uyğun planı seçin və ya sadəcə ehtiyacınız olan qədər credit alın.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
        {plansList.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative flex flex-col p-8 rounded-3xl bg-card border shadow-sm ${
              plan.popular ? "border-primary shadow-md scale-105 z-10" : "border-border"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Ən məşhur
                </span>
              </div>
            )}
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-muted-foreground text-sm h-10">{plan.description}</p>
            </div>
            <div className="mb-6 flex items-baseline text-4xl font-extrabold">
              ${plan.priceMonthly / 100}
              <span className="text-muted-foreground text-lg font-normal ml-1">/ay</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start text-sm">
                  <Check className="h-5 w-5 text-primary mr-3 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              className="w-full rounded-xl h-12"
              variant={plan.popular ? "default" : "outline"}
            >
              {plan.id === "free" ? "Pulsuz Başla" : "Planı Seç"}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Credit Packs */}
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Birdəfəlik Credit Paketləri</h2>
        <p className="text-muted-foreground mb-12">
          Aylıq abunə olmaq istəmirsiniz? Sadəcə istifadə edəcəyiniz qədər credit alın.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {CREDIT_PACKS.map((pack, i) => (
            <div key={i} className={`p-6 rounded-2xl border bg-card flex flex-col items-center justify-center ${pack.popular ? 'border-primary bg-primary/5' : ''}`}>
              <div className="text-3xl font-bold mb-2">{pack.credits}</div>
              <div className="text-muted-foreground text-sm mb-4">credit</div>
              <div className="text-xl font-semibold mb-6">${pack.priceCents / 100}</div>
              <Button variant={pack.popular ? "default" : "outline"} className="w-full rounded-full">
                Alın
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
