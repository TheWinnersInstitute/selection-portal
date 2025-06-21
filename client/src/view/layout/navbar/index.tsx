"use client";

import Link from "next/link";
import React, { PropsWithChildren } from "react";
import { ModeToggle } from "./toggle-theme";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
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
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import {
  Book,
  BookUser,
  GraduationCap,
  HandCoins,
  MonitorCogIcon,
  User,
  Users,
} from "lucide-react";

const items = [
  {
    title: "Boards",
    url: "/admin/board",
    icon: Book,
  },
  {
    title: "Exams",
    url: "/admin/exam",
    icon: BookUser,
  },
  {
    title: "Students",
    url: "/admin/student",
    icon: GraduationCap,
  },
  {
    title: "Lucky draw",
    url: "/admin/lucky-draw",
    icon: HandCoins,
  },
  {
    title: "Roles",
    url: "/admin/role",
    icon: MonitorCogIcon,
  },
  {
    title: "Users",
    url: "/admin/user",
    icon: Users,
  },
];

export default function Navbar({ children }: PropsWithChildren) {
  const { isAuthenticated, user, logoutHandler } = useAuth();
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen={false}>
      <Sidebar>
        <SidebarHeader>
          <h1 className="text-center font-semibold mt-4">Admin Panel</h1>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
      <main className="w-[100vw]">
        <nav className="w-full sticky bg-[#020618] top-0 py-4 px-[5%] shadow-none flex justify-between">
          <div className="flex items-center gap-2">
            {pathname.includes("/admin/") && <SidebarTrigger />}
            <h1 className="text-lg font-bold">Selection portal</h1>
          </div>
          <div className="flex gap-2 items-center">
            <ModeToggle />
            {user.role === "admin" && (
              <Link href="/admin/board">
                <Button>Admin</Button>
              </Link>
            )}
            {isAuthenticated && (
              <Button onClick={logoutHandler} variant="outline" color="">
                Logout
              </Button>
            )}
            {!isAuthenticated && (
              <Link href="/login">
                <Button>Login/Register</Button>
              </Link>
            )}
          </div>
        </nav>
        {children}
      </main>
    </SidebarProvider>
  );
}
