"use client";

import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { fetchUserAccount } from "@/lib/api";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const setUser = useAppStore((state) => state.setUser);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await fetchUserAccount();
        setUser(user);
      } catch {
        setUser(null);
      }
    };
    initAuth();
  }, [setUser]);

  return children;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthInitializer>{children}</AuthInitializer>
      <Toaster position="top-center" />
    </>
  );
}