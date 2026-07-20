"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, CreditCard, ShieldAlert, ArrowLeft } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

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
  useSidebar,
} from "@/components/ui/sidebar";

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="bg-slate-950 text-slate-200 border-r-slate-800">
      <SidebarHeader className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-red-600 text-white">
            <ShieldAlert className="size-5" />
          </div>
          {state !== "collapsed" && (
            <div className="flex flex-col">
              <span className="font-bold text-sm text-slate-100">Admin Panel</span>
              <span className="text-xs text-slate-400">İdarəetmə Mərkəzi</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500">Menyu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  render={<Link href="/admin" />} 
                  isActive={pathname === "/admin"}
                  className="hover:bg-slate-800 hover:text-white data-[active=true]:bg-slate-800 data-[active=true]:text-white"
                >
                  <LayoutDashboard className="size-4" />
                  <span>İcmal (Dashboard)</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  render={<Link href="/admin/users" />} 
                  isActive={pathname.startsWith("/admin/users")}
                  className="hover:bg-slate-800 hover:text-white data-[active=true]:bg-slate-800 data-[active=true]:text-white"
                >
                  <Users className="size-4" />
                  <span>İstifadəçilər</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  render={<Link href="/admin/transactions" />} 
                  isActive={pathname.startsWith("/admin/transactions")}
                  className="hover:bg-slate-800 hover:text-white data-[active=true]:bg-slate-800 data-[active=true]:text-white"
                >
                  <CreditCard className="size-4" />
                  <span>Tranzaksiyalar</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-800 pt-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              render={<Link href="/dashboard" />}
              className="text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <ArrowLeft className="size-4" />
              <span>Platformaya Qayıt</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 px-2 py-2 mt-2">
              <UserButton 
                afterSignOutUrl="/" 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "size-8 rounded-full border border-slate-700"
                  }
                }}
              />
              {state !== "collapsed" && (
                <div className="flex flex-col overflow-hidden">
                  <span className="truncate text-sm font-medium text-slate-200">
                    {user?.fullName || user?.firstName || "Admin"}
                  </span>
                  <span className="truncate text-xs text-slate-500">
                    {user?.primaryEmailAddress?.emailAddress}
                  </span>
                </div>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
