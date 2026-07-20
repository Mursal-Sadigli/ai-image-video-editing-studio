"use client";

import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AdminTransactionsPage() {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["admin_transactions"],
    queryFn: async () => {
      const res = await fetch("/api/admin/transactions");
      if (!res.ok) throw new Error("Tranzaksiyaları yükləyərkən xəta");
      const data = await res.json();
      return data.transactions;
    },
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Kredit Tranzaksiyaları (Loqlar)</h2>
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
