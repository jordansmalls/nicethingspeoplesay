"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Sparkles,
  Download,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { useAppStore } from "@/stores/useAppStore"
import { logout } from "@/lib/api"
import { toast } from "sonner"
import { useState } from "react"
import { Button } from "./ui/button"

const navItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Things",
    url: "/things",
    icon: Sparkles,
  },
  {
    title: "Export",
    url: "/export",
    icon: Download,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logoutUser } = useAppStore()
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logout()
      logoutUser()
      toast.success("Logged out successfully")
      router.push("/login")
    } catch (error: any) {
      toast.error(error.message || "Failed to logout")
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">ntps</span>
            <span className="text-xs text-muted-foreground">
              nice things people say
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton asChild isActive={pathname === item.url}>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator className="mb-2" />
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="relative">
              <SidebarMenuButton
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="w-full"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-1 flex-col items-start text-left">
                  <span className="text-sm font-medium">Account</span>
                  <span className="text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
                <ChevronDown
                  className={`ml-auto transition-transform ${
                    showAccountMenu ? "rotate-180" : ""
                  }`}
                />
              </SidebarMenuButton>

              {showAccountMenu && (
                <div className="absolute bottom-full left-0 right-0 mb-2 rounded-md border bg-popover p-1 shadow-md">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm"
                    onClick={() => {
                      setShowAccountMenu(false)
                      router.push("/account")
                    }}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </Button>
                </div>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}