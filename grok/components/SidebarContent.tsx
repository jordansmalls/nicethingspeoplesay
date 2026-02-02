// components/SidebarContent.tsx
"use client";

import { useAppStore } from "@/stores/useAppStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { logout } from "@/lib/api";
import { Heart } from "lucide-react"; // Assuming lucide for icon, replace with hugeicons if installed

export default function SidebarContent() {
  const { user, logoutUser } = useAppStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      logoutUser();
      toast("Logged out successfully");
      router.push("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="p-4 space-y-6 h-full flex flex-col">
      <div className="flex items-center space-x-2">
        <Heart className="h-6 w-6" />
        <div>
          <h1 className="font-bold">ntps</h1>
          <p className="text-xs text-muted-foreground">nice things people say</p>
        </div>
      </div>
      <nav className="space-y-2">
        <Link href="/" className="block py-2 hover:bg-accent rounded">Dashboard</Link>
        <Link href="/things" className="block py-2 hover:bg-accent rounded">Things</Link>
        <Link href="/export" className="block py-2 hover:bg-accent rounded">Export</Link>
      </nav>
      <Separator />
      <div className="mt-auto space-y-2">
        <p className="text-sm truncate">{user?.email}</p>
        <Link href="/account" className="block py-2 hover:bg-accent rounded">Settings</Link>
        <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  );
}