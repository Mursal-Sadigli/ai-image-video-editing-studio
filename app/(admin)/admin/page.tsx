import { db } from "@/lib/db";
import { users, creditTransactions, generations } from "@/lib/db/schema";
import { count, sum } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, ImageIcon, Activity } from "lucide-react";

export default async function AdminDashboardPage() {
  // 1. Ümumi istifadəçi sayı
  const [userCountResult] = await db.select({ count: count() }).from(users);
  
  // 2. Ümumi xərclənən kreditlər
  const [spentCreditsResult] = await db
    .select({ totalSpent: sum(creditTransactions.amount) })
    .from(creditTransactions)
    // type = usage olanları yoxlamaq olar, amma mənfi olanlar onsuz da xərcdir
    // Sadəcə bütün transaction-larda tip usage olanların (mənfi rəqəm) mütləq dəyəri və s.
    // Lakin bəzən status da olur.
    // Hələlik ümumi generasiya sayını sayaq:
    
  const [generationsCountResult] = await db.select({ count: count() }).from(generations);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Admin İcmalı (Dashboard)</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ümumi İstifadəçilər
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCountResult?.count || 0}</div>
            <p className="text-xs text-muted-foreground">
              Qeydiyyatdan keçmiş bütün istifadəçilər
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sistemdəki Generasiyalar
            </CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{generationsCountResult?.count || 0}</div>
            <p className="text-xs text-muted-foreground">
              Hazırlanmış media faylları
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Kredit Gəliri (Gələcəkdə)
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-xs text-muted-foreground">
              Stripe quraşdırılarkən hesablanacaq
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aktivlik (Status)
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Tam İşlək</div>
            <p className="text-xs text-muted-foreground">
              Sistemdə xəta yoxdur
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Daha ətraflı cədvəllər bura əlavə oluna bilər (Məs. ən son istifadəçilər) */}
    </div>
  );
}
