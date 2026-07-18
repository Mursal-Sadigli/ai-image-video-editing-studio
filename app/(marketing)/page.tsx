"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Wand2, Image as ImageIcon, Film, Eraser, ZoomIn } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ParticleWave } from "@/components/ui/particle-wave";
import { useAuth } from "@clerk/nextjs";

export default function LandingPage() {
  const { userId } = useAuth();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex flex-col items-center overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-background" />
        <ParticleWave
          className="absolute inset-0 z-0 opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 z-0 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-500/20 blur-[120px] rounded-full pointer-events-none z-0" />

        <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border bg-background/50 backdrop-blur-sm px-3 py-1 text-sm font-medium mb-4"
          >
            <Sparkles className="h-4 w-4 mr-2 animate-sparkle" />
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Yeni: AI Video Generation artıq mövcuddur
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6 max-w-4xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-balance">
              Real fotodan seçilməyən{" "}
              <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                hyper-realistic
              </span>{" "}
              generasiya
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
              Studio keyfiyyətli nəticəni bir neçə dəqiqədə, bir promptla əldə edin. E-commerce, marketinq və peşəkar yaradıcılar üçün.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 mt-8"
          >
            {!userId ? (
              <Link href="/sign-up" className={buttonVariants({ size: "lg", className: "text-md px-8 h-12 rounded-full group" })}>
                Pulsuz başla
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <Link href="/dashboard" className={buttonVariants({ size: "lg", className: "text-md px-8 h-12 rounded-full group" })}>
                Dashboard-a keç
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
            <Dialog>
              <DialogTrigger className={buttonVariants({ variant: "outline", size: "lg", className: "text-md px-8 h-12 rounded-full bg-background/50 backdrop-blur-sm cursor-pointer" })}>
                Demo-ya bax
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/90 border-zinc-800">
                <video
                  src="/api/video"
                  autoPlay
                  controls
                  className="w-full h-auto aspect-video"
                />
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="w-full py-24 md:py-32 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Hər ehtiyaca uyğun AI alətləri</h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Bir platformada bütün vizual yaratma və redaktə imkanları. İstər şəkil, istərsə də video.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {[
              { title: "Image Generation", desc: "Mətndən fotorealistik şəkillər", icon: ImageIcon, color: "text-blue-500", bg: "bg-blue-500/10" },
              { title: "Video Generation", desc: "Mətn və ya şəkildən videolar", icon: Film, color: "text-purple-500", bg: "bg-purple-500/10" },
              { title: "Background Removal", desc: "Bir klikdə arxa fonu silin", icon: Eraser, color: "text-pink-500", bg: "bg-pink-500/10" },
              { title: "Image-to-Image", desc: "Mövcud şəkli transformasiya edin", icon: Wand2, color: "text-orange-500", bg: "bg-orange-500/10" },
              { title: "AI Upscaler", desc: "Detalları itirmədən keyfiyyəti artırın", icon: ZoomIn, color: "text-green-500", bg: "bg-green-500/10" },
              { title: "Object Removal", desc: "İstənməyən obyektləri silin", icon: Eraser, color: "text-red-500", bg: "bg-red-500/10" },
            ].map((tool, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="group relative overflow-hidden p-6 border rounded-2xl bg-background shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className={`inline-flex p-2.5 rounded-xl ${tool.bg} mb-4 transition-transform group-hover:scale-110`}>
                  <tool.icon className={`h-5 w-5 ${tool.color}`} />
                </div>
                <h3 className="text-lg font-bold mb-2">{tool.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{tool.desc}</p>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-500/10 rounded-2xl transition-colors pointer-events-none" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative w-full py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-zinc-950 dark:bg-zinc-900" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-950/50" />
        <div className="container relative z-10 px-4 md:px-6 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
              Yaradıcılığınızı sərhədsizləşdirin
            </h2>
            <p className="text-zinc-400 text-xl leading-relaxed">
              İlk 20 generasiyanız bizdən. Qeydiyyatdan keçin və bu gün studio keyfiyyətində vizuallar yaratmağa başlayın.
            </p>
            <Link href="/sign-up" className={buttonVariants({ size: "lg", className: "text-md px-10 h-14 rounded-full bg-white text-zinc-950 hover:bg-zinc-200" })}>
              İndi pulsuz başla
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
