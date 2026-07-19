import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AI_TOOLS } from "@/config/ai-tools";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import * as Icons from "lucide-react";

export const metadata = {
  title: "Studiya | Vision AI",
  description: "Vision AI studiyasına xoş gəlmisiniz.",
};

export default async function StudioPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Studiya</h1>
        <p className="text-muted-foreground mt-1">
          Bütün AI alətləri bir yerdə. İzləmək istədiyiniz funksiyanı seçin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AI_TOOLS.filter(t => t.isAvailable).map((tool) => {
          const Icon = (Icons as any)[tool.icon] || Icons.Wand2;
          
          return (
            <Link key={tool.id} href={tool.href}>
              <Card className="hover:border-primary transition-all cursor-pointer h-full">
                <CardHeader>
                  <Icon className="w-8 h-8 mb-2 text-primary" />
                  <CardTitle>{tool.name}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm font-medium text-primary">
                    İndi başla
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
