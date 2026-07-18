import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { currentUser } from "@clerk/nextjs/server";
import { syncNewUser } from "@/lib/clerk/sync-user";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  // Qeydiyyatdan keçən istifadəçinin DB-də mütləq mövcud olmasını təmin edir (Webhook gecikmələrinə və ya local dev mühitinə qarşı)
  await syncNewUser({
    clerkId: user.id,
    email: user.emailAddresses[0]?.emailAddress || "",
    fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || null,
    avatarUrl: user.imageUrl || null,
  });

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-zinc-50 dark:bg-zinc-950">
        <AppSidebar />
        <div className="flex-1 flex flex-col w-full overflow-hidden">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
            <SidebarTrigger className="-ml-2" />
            <div className="flex flex-1 items-center gap-4">
              {/* Optional: Breadcrumbs or Search could go here */}
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6 md:p-8 w-full">
            <div className="mx-auto max-w-6xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
