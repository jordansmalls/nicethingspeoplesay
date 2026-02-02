// app/(app)/page.tsx
"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/stores/useAppStore";
import { getAllThings } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ThingCard } from "@/components/thing-card";
import { EmptyState } from "@/components/empty-state";
import { CreateThingDialog } from "@/components/create-thing-dialog";
import { Plus, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const {
    things,
    isThingsLoading,
    setThings,
    openCreateModal,
  } = useAppStore();

  useEffect(() => {
    const loadThings = async () => {
      try {
        const data = await getAllThings();
        setThings(data);
      } catch (error) {
        // Error handled by API
      }
    };
    loadThings();
  }, [setThings]);

  const recentThings = things.slice(0, 5);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-neutral-500">Your collection of nice things</p>
        </div>
        <Button onClick={openCreateModal} className="gap-2">
          <Plus className="h-4 w-4" />
          Add thing
        </Button>
      </motion.div>

      {isThingsLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        </div>
      ) : things.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div>
            <h2 className="text-sm font-medium text-neutral-500 mb-4">
              Recent ({recentThings.length})
            </h2>
            <div className="space-y-3">
              {recentThings.map((thing, index) => (
                <ThingCard key={thing._id} thing={thing} index={index} />
              ))}
            </div>
          </div>

          {things.length > 5 && (
            <Button variant="ghost" className="w-full" asChild>
              <a href="/things">View all {things.length} things</a>
            </Button>
          )}
        </motion.div>
      )}

      <CreateThingDialog />
    </div>
  );
}