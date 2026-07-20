import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    redirect("/sign-in");
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkId),
  });

  if (!dbUser || (dbUser.role !== "admin" && dbUser.role !== "owner")) {
    // Əgər admin və ya owner deyilsə, normal dashboard-a yönləndir
    redirect("/dashboard");
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto flex flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 px-6 backdrop-blur">
            <SidebarTrigger />
            <div className="font-semibold text-sm">Admin Tənzimləmələri</div>
          </header>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
