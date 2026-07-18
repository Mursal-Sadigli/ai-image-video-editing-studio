import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
