"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useActiveTeam } from "@/hooks/use-active-team";
import { Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewTeamPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setActiveTeamId } = useActiveTeam();
  const [teamName, setTeamName] = useState("");

  const createTeamMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: teamName }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Xəta baş verdi");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast.success("Komanda uğurla yaradıldı!");
      setActiveTeamId(data.team.id);
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      router.push("/team");
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  return (
    <div className="flex h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Yeni Komanda Yarat</CardTitle>
          <CardDescription>
            Komanda yaradaraq layihələrinizi və kreditlərinizi digər istifadəçilərlə paylaşın.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium leading-none">
                Komanda Adı
              </label>
              <Input 
                id="name" 
                placeholder="Məs: Kreativ Agentlik" 
                value={teamName} 
                onChange={(e) => setTeamName(e.target.value)} 
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>Geri</Button>
          <Button 
            onClick={() => createTeamMutation.mutate()} 
            disabled={createTeamMutation.isPending || !teamName.trim()}
          >
            {createTeamMutation.isPending ? "Yaradılır..." : "Yarat"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
