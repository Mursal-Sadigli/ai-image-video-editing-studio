"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { PLANS, CREDIT_PACKS } from "@/config/pricing";
import { format } from "date-fns";
import { az } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function BillingPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    if (user?.id) {
      fetch("/api/subscriptions/current")
        .then(res => res.json())
        .then(data => {
          if (data.subscription) {
            setSubscription(data.subscription);
          }
        })
        .catch(console.error);
        
      setBalance(20);
    }
  }, [user]);

  const currentPlanId = subscription?.status === "active" ? subscription.plan : "free";

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

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle>Sizin Cari Planınız</CardTitle>
            <CardDescription>
              {currentPlanId === "free" ? "Aktiv ödənişli planınız yoxdur" : "Abonəliyiniz aktivdir"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-3xl font-bold capitalize">{currentPlanId === "free" ? "Pulsuz" : currentPlanId} Plan</p>
                {subscription && subscription.status === "active" && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Növbəti yenilənmə: {format(new Date(subscription.currentPeriodEnd), "dd MMMM yyyy", { locale: az })}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Cari Balans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{balance}</div>
            <p className="text-sm text-muted-foreground mt-2">kredit qaldı</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CREDIT_PACKS.map((pack) => (
          <Card key={pack.name}>
            <CardHeader>
              <CardTitle>{pack.name}</CardTitle>
              <CardDescription>{pack.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${pack.price}</div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleBuyCredits(pack.credits)} disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Satın Al
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
