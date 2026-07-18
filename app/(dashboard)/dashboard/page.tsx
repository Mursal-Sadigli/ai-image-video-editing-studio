import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AI_TOOLS } from "@/config/ai-tools";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, CreditCard, ArrowRight, Activity } from "lucide-react";
import * as Icons from "lucide-react";

export default async function DashboardPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  // MOCK: Gələcəkdə db-dən oxunacaq
  const credits = 20;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Xoş gəldin, {user.firstName || "İstifadəçi"}! 👋</h1>
          <p className="text-muted-foreground mt-1">Bu gün nə yaratmaq istəyirsən?</p>
        </div>
        <div className="flex gap-3">
          <Link href="/projects">
            <Button variant="outline">Layihələrə bax</Button>
          </Link>
          <Link href="/studio/image-generation">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Generasiya
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Credits Card */}
        <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <CreditCard className="mr-2 h-4 w-4 text-indigo-500" />
              Kredit Balansı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-4xl font-bold">{credits}</span>
                <span className="text-muted-foreground ml-2">kredit qaldı</span>
              </div>
              <Link href="/pricing">
                <Button size="sm" variant="secondary" className="font-semibold text-indigo-600 bg-white hover:bg-white/90">
                  Artır
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-4">Free plandasınız.</p>
          </CardContent>
        </Card>

        {/* Quick Stats or Promo */}
        <Card className="md:col-span-2 relative overflow-hidden bg-zinc-950 text-white">
          <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[64px]" />
          <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
            <div>
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                Pro-ya keç, Sərhədləri qır
              </h3>
              <p className="text-zinc-400 max-w-md">
                Daha sürətli generasiya, yüksək keyfiyyət və komanda işi imkanlarından yararlanmaq üçün Pro plana keç.
              </p>
            </div>
            <div className="mt-4">
              <Link href="/pricing">
                <Button variant="outline" className="text-white border-zinc-700 hover:bg-zinc-800 hover:text-white">
                  Planlara bax
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tools Grid */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-muted-foreground" />
          Sürətli Başlanğıc
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {AI_TOOLS.map((tool) => {
            // @ts-ignore
            const Icon = Icons[tool.icon] || Sparkles;
            return (
              <Link key={tool.id} href={`/studio/${tool.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full border-zinc-200 dark:border-zinc-800">
                  <CardHeader className="p-4 pb-2">
                    <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-2">
                      <Icon className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <CardTitle className="text-base font-semibold">{tool.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <CardDescription className="text-xs">{tool.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-muted-foreground" />
          Son Fəaliyyət
        </h2>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
            <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-4">
              <History className="h-6 w-6 opacity-50" />
            </div>
            <p>Hələ heç bir generasiya etməmisiniz.</p>
            <Link href="/studio/image-generation" className="mt-4 text-primary hover:underline font-medium text-sm">
              İlk şəklinizi yaradın
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
