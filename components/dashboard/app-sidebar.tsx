"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Sparkles, LayoutDashboard, FolderOpen, History, Settings, Users, CreditCard, Wand2 } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { AI_TOOLS } from "@/config/ai-tools";
import { TeamSwitcher } from "./team-switcher";

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
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Əsas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link href="/dashboard" />} isActive={pathname === "/dashboard"}>
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link href="/projects" />} isActive={pathname.startsWith("/projects")}>
                  <FolderOpen />
                  <span>Layihələr</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link href="/history" />} isActive={pathname.startsWith("/history")}>
                  <History />
                  <span>Tarixçə</span>
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
                  <CollapsibleTrigger render={<SidebarMenuButton tooltip="AI Alətləri" />}>
                    <Wand2 />
                    <span>Alətlər</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {AI_TOOLS.map((tool) => {
                        // @ts-ignore
                        const Icon = Icons[tool.icon] || Icons.Wand2;
                        return (
                          <SidebarMenuSubItem key={tool.id}>
                            <SidebarMenuSubButton render={<Link href={`/studio/${tool.id}`} />} isActive={pathname === `/studio/${tool.id}`}>
                              <Icon className="mr-2 size-4" />
                              <span>{tool.name}</span>
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
                <SidebarMenuButton render={<Link href="/team" />} isActive={pathname.startsWith("/team")}>
                  <Users />
                  <span>Komanda</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link href="/billing" />} isActive={pathname.startsWith("/billing")}>
                  <CreditCard />
                  <span>Ödənişlər</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link href="/settings" />} isActive={pathname.startsWith("/settings")}>
                  <Settings />
                  <span>Tənzimləmələr</span>
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
