"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function BillingPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);

  // Gələcəkdə Server Component-də db-dən oxumaq olar, amma indi MVP üçün /api endpoint çağırırıq (yoxdursa sadə mock)
  // Reallıqda `/api/credits/balance` olmalıdır. Mən mock data qoyuram ki, istifadəçi görsün.
  useEffect(() => {
    // Burada əslində balance endpointinə fetch olmalıdır
    setBalance(20);
  }, []);

  const handleBuyCredits = async (amount: number) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creditsAmount: amount, priceId: "custom" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Xəta baş verdi");
      }

      // Yönləndirmə
      window.location.href = data.url;
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto" /></div>;
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ödəniş və Kreditlər</h1>
        <p className="text-muted-foreground mt-1">
          Kredit balansınızı idarə edin və yeni paketlər alın.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balans Kartı */}
        <Card className="md:col-span-1 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Cari Balans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{balance}</div>
            <p className="text-sm text-muted-foreground mt-2">kredit qaldı</p>
          </CardContent>
        </Card>

        {/* Paket Alış Kartları */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>100 Kredit</CardTitle>
              <CardDescription>Sürətli başlanğıc üçün</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$5.00</div>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Bütün AI alətləri</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Son istifadə tarixi yoxdur</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleBuyCredits(100)} 
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Satın Al
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-primary shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
              Populyar
            </div>
            <CardHeader>
              <CardTitle>500 Kredit</CardTitle>
              <CardDescription>Peşəkar layihələr üçün</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$20.00</div>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Bütün AI alətləri</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Son istifadə tarixi yoxdur</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> 20% qənaət (bonus)</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant="default"
                onClick={() => handleBuyCredits(500)} 
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Satın Al
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
