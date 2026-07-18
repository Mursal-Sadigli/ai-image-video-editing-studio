"use client";

import { AI_TOOLS } from "@/config/ai-tools";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function FeaturesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32 w-full">
      <div className="text-center space-y-4 mb-20">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">Hər şey bir yerdə</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Şəkil və video generasiyasından tam redaktəyə qədər bütün AI ehtiyaclarınız üçün vahid platforma.
        </p>
      </div>

      <div className="space-y-32">
        {AI_TOOLS.map((tool, idx) => {
          // @ts-ignore - dynamic icon loading
          const Icon = Icons[tool.icon] || Icons.Wand2;
          const isEven = idx % 2 === 0;

          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className={`flex flex-col gap-12 lg:gap-24 items-center ${
                isEven ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Content Side */}
              <div className="flex-1 space-y-6">
                <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4 text-primary">
                  <Icon className="h-8 w-8" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">{tool.name}</h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {tool.description}
                </p>
                <div className="flex items-center gap-4 pt-4">
                  <div className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
                    {tool.creditCost} credit / generasiya
                  </div>
                  <Link href={`/studio/${tool.id}`} className={buttonVariants({ variant: "outline", className: "rounded-full" })}>
                    Sınaqdan keçir
                  </Link>
                </div>
              </div>

              {/* Visual Side */}
              <div className="w-full max-w-md lg:max-w-lg shrink-0">
                <div className="aspect-[4/3] rounded-3xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-2xl overflow-hidden relative group">
                  {tool.demoVideo ? (
                    <video
                      src={tool.demoVideo}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <Image
                      src={tool.demoImage || "/images/demo-before-after.png"}
                      alt={`${tool.name} Demo`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent mix-blend-overlay pointer-events-none" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
