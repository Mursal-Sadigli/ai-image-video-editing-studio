"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActiveTeam } from "@/hooks/use-active-team";
import { Users, Mail, Trash2, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function TeamPage() {
  const { activeTeamId } = useActiveTeam();
  const queryClient = useQueryClient();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");

  const { data: members, isLoading } = useQuery({
    queryKey: ["teamMembers", activeTeamId],
    queryFn: async () => {
      if (!activeTeamId) return null;
      const res = await fetch(`/api/team/members?teamId=${activeTeamId}`);
      if (!res.ok) throw new Error("Gözlənilməz xəta baş verdi");
      const data = await res.json();
      return data.members;
    },
    enabled: !!activeTeamId,
  });

  const inviteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId: activeTeamId, email: inviteEmail, role: inviteRole }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error?.[0]?.message || "Gözlənilməz xəta");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast.success("Dəvət yaradıldı!");
      // Şablon olaraq linki burda göstəririk
      setGeneratedLink(`${window.location.origin}/team/invite?token=${data.invite.token}`);
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ memberUserId, newRole }: { memberUserId: string, newRole: string }) => {
      const res = await fetch("/api/team/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId: activeTeamId, memberUserId, newRole }),
      });
      if (!res.ok) throw new Error("Gözlənilməz xəta");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Rol dəyişdirildi");
      queryClient.invalidateQueries({ queryKey: ["teamMembers", activeTeamId] });
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (memberUserId: string) => {
      const res = await fetch("/api/team/members", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId: activeTeamId, memberUserId }),
      });
      if (!res.ok) throw new Error("Gözlənilməz xəta");
      return res.json();
    },
    onSuccess: () => {
      toast.success("İstifadəçi komandadan çıxarıldı");
      queryClient.invalidateQueries({ queryKey: ["teamMembers", activeTeamId] });
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  if (!activeTeamId) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <Users className="size-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Komanda mühiti seçilməyib</h2>
        <p className="text-muted-foreground max-w-sm mb-6">
          Komanda üzvlərini idarə etmək üçün sol menyudakı seçicidən hər hansı komandanı seçin və ya yeni komanda yaradın.
        </p>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Komanda İdarəetməsi</h1>
          <p className="text-muted-foreground mt-1">Komandanıza üzv dəvət edin və onların rollarını tənzimləyin.</p>
        </div>
        
        <Dialog open={isInviteOpen} onOpenChange={(open) => {
          setIsInviteOpen(open);
          if (!open) {
            setGeneratedLink("");
            setInviteEmail("");
          }
        }}>
          <DialogTrigger render={
            <Button>
              <Mail className="mr-2 size-4" />
              Üzv Dəvət Et
            </Button>
          } />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Komandaya dəvət göndər</DialogTitle>
              <DialogDescription>
                İstifadəçinin e-poçt ünvanını daxil edərək onu komandanıza dəvət edin.
              </DialogDescription>
            </DialogHeader>
            {!generatedLink ? (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="email">E-poçt</label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="orxan@nümunə.com" 
                    value={inviteEmail} 
                    onChange={(e) => setInviteEmail(e.target.value)} 
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="role">Rol</label>
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Rol seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Redaktor (Editor)</SelectItem>
                      <SelectItem value="viewer">İzləyici (Viewer)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={() => inviteMutation.mutate()} 
                  disabled={inviteMutation.isPending || !inviteEmail}
                >
                  {inviteMutation.isPending ? "Dəvət yaradılır..." : "Dəvət Göndər"}
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 py-4">
                <p className="text-sm">Aşağıdakı linki kopyalayıb dəvət edəcəyiniz şəxsə göndərin:</p>
                <div className="flex gap-2">
                  <Input readOnly value={generatedLink} />
                  <Button onClick={() => {
                    navigator.clipboard.writeText(generatedLink);
                    toast.success("Link kopyalandı!");
                  }}>
                    Kopyala
                  </Button>
                </div>
                <Button variant="outline" onClick={() => setGeneratedLink("")}>
                  Yeni dəvət göndər
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>İstifadəçi</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Qoşulma Tarixi</TableHead>
              <TableHead className="text-right">Əməliyyatlar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Yüklənir...
                </TableCell>
              </TableRow>
            ) : members?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Hələ heç bir üzv yoxdur.
                </TableCell>
              </TableRow>
            ) : (
              members?.map((member: any) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                        {member.user?.imageUrl ? (
                          <img src={member.user.imageUrl} alt="avatar" className="rounded-full" />
                        ) : (
                          <Users className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{member.user?.name || "Naməlum İstifadəçi"}</span>
                        <span className="text-xs text-muted-foreground">{member.user?.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select 
                      defaultValue={member.role}
                      onValueChange={(val) => updateRoleMutation.mutate({ memberUserId: member.userId, newRole: val })}
                      disabled={member.role === "owner"}
                    >
                      <SelectTrigger className="w-[130px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="owner" disabled>Sahib (Owner)</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="editor">Redaktor</SelectItem>
                        <SelectItem value="viewer">İzləyici</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={
                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={member.role === "owner"}>
                          <span className="sr-only">Menyunu aç</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      } />
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                          onClick={() => {
                            if(confirm("Bu istifadəçini komandadan çıxarmaq istədiyinizə əminsiniz?")) {
                              removeMemberMutation.mutate(member.userId);
                            }
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Çıxar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
