"use client";

import { motion } from "framer-motion";
import { UploadCloud, Sparkles, Download } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      title: "Məlumatı daxil edin",
      desc: "İstədiyiniz təsviri (prompt) yazın və ya mövcud şəklinizi/videonuzu sistemə yükləyin.",
      icon: UploadCloud,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Süni İntellekt işləyir",
      desc: "VisionAI saniyələr içində detallı analiz aparır və yüksək realizmli nəticəni formalaşdırır.",
      icon: Sparkles,
      color: "from-indigo-500 to-purple-500",
    },
    {
      title: "Nəticəni əldə edin",
      desc: "Hazır olan media faylını tətbiq edin, layihənizə yükləyin və ya birbaşa dostlarınızla paylaşın.",
      icon: Download,
      color: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <section className="w-full py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="container px-4 md:px-6 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Necə İşləyir?</h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Sərhədsiz yaradıcılıq cəmi 3 sadə addımdan ibarətdir. Heç bir texniki bilik tələb olunmur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative max-w-5xl mx-auto">
          {/* Bağlayıcı xətt (desktop) */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent z-0" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center space-y-4"
            >
              <div className={`w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br ${step.color} shadow-lg shadow-indigo-500/20 text-white`}>
                <step.icon className="w-10 h-10" />
              </div>
              <div className="space-y-2 mt-4">
                <h3 className="text-xl font-bold">
                  <span className="text-muted-foreground text-sm font-normal mr-2">0{i + 1}.</span>
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
