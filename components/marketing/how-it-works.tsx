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
          <div 
            className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] z-0 overflow-hidden"
            style={{ 
              maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)"
            }}
          >
            <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800" />
            <motion.div
              className="absolute top-0 bottom-0 w-[40%] bg-gradient-to-r from-transparent via-blue-500 to-transparent"
              animate={{ left: ["-40%", "120%"] }}
              transition={{ duration: 3, ease: "linear", repeat: Infinity }}
            />
          </div>

          {/* Bağlayıcı xətt (mobile) */}
          <div 
            className="block md:hidden absolute top-[5%] bottom-[5%] left-1/2 -translate-x-1/2 w-[2px] z-0 overflow-hidden"
            style={{ 
              maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)"
            }}
          >
            <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800" />
            <motion.div
              className="absolute left-0 right-0 h-[40%] bg-gradient-to-b from-transparent via-blue-500 to-transparent"
              animate={{ top: ["-40%", "120%"] }}
              transition={{ duration: 3, ease: "linear", repeat: Infinity }}
            />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center space-y-4"
            >
              <motion.div 
                className={`w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br ${step.color} shadow-lg shadow-indigo-500/20 text-white relative`}
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.8, // Add delay to create a sequential wave effect
                }}
              >
                <step.icon className="w-10 h-10" />
              </motion.div>
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
