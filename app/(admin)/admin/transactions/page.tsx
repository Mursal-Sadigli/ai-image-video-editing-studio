"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export default function AdminTransactionsPage() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["admin_transactions"],
    queryFn: async () => {
      const res = await fetch("/api/admin/transactions");
      if (!res.ok) throw new Error("Tranzaksiyaları yükləyərkən xəta");
      const data = await res.json();
      return data.transactions;
    },
  });

  const queryClient = useQueryClient();

  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/transactions", { method: "DELETE" });
      if (!res.ok) throw new Error("Silinmə zamanı xəta");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Bütün loqlar silindi");
      setIsDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin_transactions"] });
    },
    onError: () => {
      toast.error("Xəta baş verdi");
    }
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Kredit Tranzaksiyaları (Loqlar)</h2>
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogTrigger render={
            <Button variant="destructive" size="sm" disabled={!transactions?.length || deleteAllMutation.isPending}>
              <Trash className="mr-2 h-4 w-4" />
              Hamısını Sil
            </Button>
          } />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Əminsinizmi?</AlertDialogTitle>
              <AlertDialogDescription>
                Bu əməliyyat geri qaytarıla bilməz. Bütün kredit əməliyyat loqları sistemdən birdəfəlik silinəcək.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Ləğv et</AlertDialogCancel>
              <AlertDialogAction 
                onClick={(e) => {
                  e.preventDefault();
                  deleteAllMutation.mutate();
                }}
                className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
              >
                Bəli, hamısını sil
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="rounded-md border bg-white dark:bg-slate-950">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>İstifadəçi</TableHead>
              <TableHead>Məbləğ</TableHead>
              <TableHead>Növ (Type)</TableHead>
              <TableHead>Təsvir (Səbəb)</TableHead>
              <TableHead>Tarix</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">Yüklənir...</TableCell>
              </TableRow>
            ) : transactions?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">Tranzaksiya tapılmadı</TableCell>
              </TableRow>
            ) : (
              transactions?.map((t: any) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{t.user?.fullName || "Naməlum"}</span>
                      <span className="text-xs text-muted-foreground">{t.user?.email}</span>
                      {t.team && (
                        <span className="text-[10px] text-blue-500 mt-1">Komanda: {t.team.name}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`font-semibold ${t.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                      {t.amount > 0 ? "+" : ""}{t.amount}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={t.type === "admin_adjustment" ? "default" : t.type === "usage" ? "destructive" : "secondary"}>
                      {t.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={t.description || ""}>
                    {t.description || "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(t.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
