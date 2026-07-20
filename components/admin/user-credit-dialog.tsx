"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreditCard, Plus, Minus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface UserCreditDialogProps {
  userId: string;
  userName: string;
  currentBalance: number;
}

export function UserCreditDialog({ userId, userName, currentBalance }: UserCreditDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"add" | "subtract">("add");
  const queryClient = useQueryClient();

  const adjustMutation = useMutation({
    mutationFn: async () => {
      const parsedAmount = parseInt(amount);
      if (isNaN(parsedAmount) || parsedAmount === 0) {
        throw new Error("Düzgün məbləğ daxil edin");
      }

      const finalAmount = type === "add" ? Math.abs(parsedAmount) : -Math.abs(parsedAmount);

      const res = await fetch("/api/admin/users/adjust-credit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          amount: finalAmount,
          description: description.trim(),
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Xəta baş verdi");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Kredit balansı yeniləndi");
      setIsOpen(false);
      setAmount("");
      setDescription("");
      queryClient.invalidateQueries({ queryKey: ["admin_users"] });
      queryClient.invalidateQueries({ queryKey: ["admin_transactions"] });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={
        <Button variant="outline" size="sm">
          <CreditCard className="mr-2 h-4 w-4" />
          Kreditlər
        </Button>
      } />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Kredit Düzəlişi</DialogTitle>
          <DialogDescription>
            <strong>{userName}</strong> istifadəçisinin hazırkı balansı: {currentBalance} kredit
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant={type === "add" ? "default" : "outline"} 
              className="flex-1"
              onClick={() => setType("add")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Əlavə et
            </Button>
            <Button 
              type="button" 
              variant={type === "subtract" ? "destructive" : "outline"} 
              className="flex-1"
              onClick={() => setType("subtract")}
            >
              <Minus className="mr-2 h-4 w-4" />
              Çıxart
            </Button>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="amount">Məbləğ</Label>
            <Input 
              id="amount" 
              type="number" 
              placeholder="Məsələn, 50" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              min="1"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Səbəb (Məcburi deyil)</Label>
            <Textarea 
              id="description" 
              placeholder="Məsələn: Təşviq kampaniyası, Geri qaytarma (Refund) və s." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={adjustMutation.isPending || !amount} onClick={() => adjustMutation.mutate()}>
            {adjustMutation.isPending ? "Gözləyin..." : "Təsdiqlə"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
