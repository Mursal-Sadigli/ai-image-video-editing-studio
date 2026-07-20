"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useActiveTeam } from "@/hooks/use-active-team";
import { Users, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function InvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { setActiveTeamId } = useActiveTeam();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const acceptMutation = useMutation({
    mutationFn: async (inviteToken: string) => {
      const res = await fetch("/api/team/invite", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: inviteToken }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Xəta baş verdi");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setStatus("success");
      setActiveTeamId(data.teamId);
      toast.success("Komandaya uğurla qoşuldunuz!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    },
    onError: (error: any) => {
      setStatus("error");
      setErrorMessage(error.message);
      toast.error(error.message);
    }
  });

  useEffect(() => {
    if (token) {
      acceptMutation.mutate(token);
    } else {
      setStatus("error");
      setErrorMessage("Token tapılmadı. Dəvət linki yanlışdır.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="flex h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Komandaya Dəvət</CardTitle>
          <CardDescription>
            Sizi komandaya qoşulmağa dəvət edirlər
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6 text-center">
          {status === "loading" && (
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p>Dəvət yoxlanılır və qəbul edilir...</p>
            </div>
          )}
          
          {status === "success" && (
            <div className="flex flex-col items-center gap-4 text-green-600">
              <CheckCircle2 className="h-16 w-16" />
              <p className="text-lg font-medium">Uğurla qoşuldunuz!</p>
              <p className="text-sm text-muted-foreground">İdarə panelinə yönləndirilirsiniz...</p>
            </div>
          )}
          
          {status === "error" && (
            <div className="flex flex-col items-center gap-4 text-destructive">
              <XCircle className="h-16 w-16" />
              <p className="text-lg font-medium">Xəta baş verdi</p>
              <p className="text-sm text-muted-foreground">{errorMessage}</p>
            </div>
          )}
        </CardContent>
        {status === "error" && (
          <CardFooter>
            <Button className="w-full" onClick={() => router.push("/dashboard")}>
              Ana Səhifəyə Qayıt
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
