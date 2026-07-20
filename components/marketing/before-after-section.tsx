"use client";

import { motion } from "framer-motion";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
import { useEffect, useState } from "react";

export function BeforeAfterSection() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <section className="w-full py-24 md:py-32 bg-zinc-950 text-zinc-50 overflow-hidden relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Süni intellekt, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">təbii toxunuş</span>
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto">
            Sıradan fotolarınızı peşəkar studiya keyfiyyətinə çatdırın. Gözlə görünən fərqi özünüz sınayın.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl shadow-indigo-500/10"
        >
          <div className="bg-zinc-900 px-4 py-3 flex items-center gap-2 border-b border-zinc-800">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="ml-4 text-xs text-zinc-500 font-mono flex-1 text-center pr-10">original.jpg vs enhanced.jpg</div>
          </div>
          
          <div className="relative aspect-[16/10] sm:aspect-video w-full bg-zinc-950">
            {/* Real layihələrdə bu şəkilləri əsl "gözəl qadın fotorelistik" şəkilləri ilə əvəzləmək lazımdır */}
            {isMounted ? (
              <ReactCompareSlider
                itemOne={<ReactCompareSliderImage src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=1200&h=800" alt="Original" />}
                itemTwo={<ReactCompareSliderImage src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=100&w=1200&h=800" style={{ filter: "contrast(1.2) saturate(1.2) brightness(1.1)" }} alt="Enhanced" />}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-zinc-900 animate-pulse" />
            )}
            
            
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium text-white border border-white/10 shadow-lg">
              Əvvəl
            </div>
            <div className="absolute top-4 right-4 bg-indigo-600/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium text-white border border-indigo-500/50 shadow-lg">
              Sonra (AI)
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
