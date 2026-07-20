"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Tacir Hüseynov",
      role: "E-commerce Sahibi",
      content: "Məhsul şəkillərimizin arxa fonunu dəyişmək və keyfiyyətini artırmaq üçün artıq fotoqrafa müraciət etmirik. VisionAI ilə saniyələr içində studiya keyfiyyəti alırıq.",
      rating: 5,
    },
    {
      name: "Ramil Rəhimov",
      role: "Video Redaktor",
      content: "Video generation xüsusiyyəti həqiqətən inqilabi bir yenilikdir. Layihələrimdə b roll (arxa plan) videoları üçün artıq stok saytlarına pul ödəmirəm.",
      rating: 5,
    },
    {
      name: "Nuray Məmmədova",
      role: "Sosial Media Meneceri",
      content: "Gündəlik postlar üçün kreativ şəkillər yaratmaq heç vaxt bu qədər asan olmamışdı. Hər bir detal o qədər reallaşır ki, izləyicilər AI olduğuna inanmır.",
      rating: 5,
    },
  ];

  return (
    <section className="w-full py-24 md:py-32 bg-zinc-50 dark:bg-zinc-900/50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Onlar bizə güvənir</h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Dünyanın dörd bir yanından minlərlə yaradıcı insan gündəlik işini VisionAI ilə sürətləndirir.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-background p-8 rounded-3xl border shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-lg leading-relaxed italic text-zinc-700 dark:text-zinc-300">
                  "{t.content}"
                </p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{t.name}</h4>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
