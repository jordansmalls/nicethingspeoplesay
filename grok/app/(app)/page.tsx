// app/(app)/page.tsx
"use client";

import { useAppStore } from "@/stores/useAppStore";
import { useEffect } from "react";
import { getAllThings } from "@/lib/api";
import Link from "next/link";
import { Button } from "../../components/ui/button";

export default function Dashboard() {
  const { things, setThings, isThingsLoading } = useAppStore();

  useEffect(() => {
    const fetchThings = async () => {
      try {
        const data = await getAllThings();
        setThings(data);
      } catch {}
    };

    if (things.length === 0 && !isThingsLoading) {
      fetchThings();
    }
  }, [things, isThingsLoading, setThings]);

  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Welcome back. You have {things.length} things.</p>
      <Link href="/things" className="text-blue-500">View things</Link>
    </div>
  );
}