// app/(app)/layout.tsx
"use client";

import { useAppStore } from "@/stores/useAppStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchUserAccount } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import CreateThingModal from "@/components/CreateThingModal";
import EditThingModal from "@/components/EditThingModal";
import DeleteThingModal from "@/components/DeleteThingModal";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import SidebarContent from "@/components/SidebarContent";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthLoading, setUser, setError, isAuthenticated, setAuthLoading } = useAppStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      setAuthLoading(true);
      try {
        const userData = await fetchUserAccount();
        setUser(userData);
      } catch (err) {
        setUser(null);
      } finally {
        setAuthLoading(false);
        setLoading(false);
      }
    };

    if (user === null && !isAuthLoading) {
      getUser();
    } else {
      setLoading(false);
    }
  }, [user, isAuthLoading, setUser, setAuthLoading]);

  if (loading || isAuthLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    router.replace("/login");
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1">
        <header className="md:hidden flex items-center p-4 border-b">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </header>
        <main className="max-w-[900px] mx-auto p-8 space-y-8">
          {children}
        </main>
      </div>
      <CreateThingModal />
      <EditThingModal />
      <DeleteThingModal />
    </div>
  );
}