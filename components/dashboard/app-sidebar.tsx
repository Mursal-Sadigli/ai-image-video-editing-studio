"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Sparkles, LayoutDashboard, FolderOpen, History, Settings, Users, CreditCard, Wand2 } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { AI_TOOLS } from "@/config/ai-tools";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import * as Icons from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { state } = useSidebar();

  // MOCK: Gələcəkdə db/context-dən gələcək
  const credits = 20;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-lg">VisionAI</span>
                  <span className="text-xs text-muted-foreground">Studio</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Əsas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
                  <Link href="/dashboard">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith("/projects")}>
                  <Link href="/projects">
                    <FolderOpen />
                    <span>Layihələr</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith("/history")}>
                  <Link href="/history">
                    <History />
                    <span>Tarixçə</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Studio</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="AI Alətləri">
                      <Wand2 />
                      <span>Alətlər</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {AI_TOOLS.map((tool) => {
                        // @ts-ignore
                        const Icon = Icons[tool.icon] || Icons.Wand2;
                        return (
                          <SidebarMenuSubItem key={tool.id}>
                            <SidebarMenuSubButton asChild isActive={pathname === `/studio/${tool.id}`}>
                              <Link href={`/studio/${tool.id}`}>
                                <Icon className="mr-2 size-4" />
                                <span>{tool.name}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Hesab</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith("/team")}>
                  <Link href="/team">
                    <Users />
                    <span>Komanda</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith("/billing")}>
                  <Link href="/billing">
                    <CreditCard />
                    <span>Ödənişlər</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith("/settings")}>
                  <Link href="/settings">
                    <Settings />
                    <span>Tənzimləmələr</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {state === "expanded" && (
          <div className="p-4 mx-2 mb-2 rounded-xl bg-primary/10 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-muted-foreground">Balansınız</span>
              <span className="text-lg font-bold text-primary">{credits} kredit</span>
            </div>
            <Link href="/pricing" className="text-xs font-semibold bg-primary text-primary-foreground px-2 py-1 rounded-md hover:bg-primary/90 transition-colors">
              Artır
            </Link>
          </div>
        )}
        <div className="flex items-center gap-3 p-3 mt-auto border-t">
          <UserButton afterSignOutUrl="/" />
          {state === "expanded" && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">{user?.fullName || "İstifadəçi"}</span>
              <span className="text-xs text-muted-foreground truncate">{user?.primaryEmailAddress?.emailAddress}</span>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
