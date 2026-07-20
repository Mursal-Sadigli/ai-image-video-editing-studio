"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, Users } from "lucide-react";
import { useActiveTeam } from "@/hooks/use-active-team";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const { activeTeamId, setActiveTeamId } = useActiveTeam();
  const router = useRouter();

  const { data: teams, isLoading } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const res = await fetch("/api/team/my-teams");
      if (!res.ok) return [];
      const data = await res.json();
      return data.teams || [];
    },
  });

  const activeTeam = React.useMemo(() => {
    if (!activeTeamId || !teams) return null;
    return teams.find((t: any) => t.id === activeTeamId) || null;
  }, [activeTeamId, teams]);

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="animate-pulse bg-muted" />
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Users className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeTeam ? activeTeam.name : "Şəxsi Hesab"}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {activeTeam ? "Komanda Mühiti" : "Fərdi Mühit"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Mühitlər
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => setActiveTeamId(null)}
              className="gap-2 p-2"
            >
              <div className="flex size-6 items-center justify-center rounded-sm border">
                <Users className="size-4 shrink-0" />
              </div>
              Şəxsi Hesab
              {activeTeamId === null && (
                <DropdownMenuShortcut>✓</DropdownMenuShortcut>
              )}
            </DropdownMenuItem>
            
            {teams && teams.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Komandalar
                </DropdownMenuLabel>
                {teams.map((team: any) => (
                  <DropdownMenuItem
                    key={team.id}
                    onClick={() => setActiveTeamId(team.id)}
                    className="gap-2 p-2"
                  >
                    <div className="flex size-6 items-center justify-center rounded-sm border">
                      {/* Placeholder for team logo or initial */}
                      <span className="text-xs font-bold uppercase">{team.name.charAt(0)}</span>
                    </div>
                    {team.name}
                    {activeTeamId === team.id && (
                      <DropdownMenuShortcut>✓</DropdownMenuShortcut>
                    )}
                  </DropdownMenuItem>
                ))}
              </>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" onClick={() => router.push("/team/new")}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Komanda yarat</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
