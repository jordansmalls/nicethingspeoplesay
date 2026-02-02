// components/empty-state.tsx
"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/stores/useAppStore";
import { Button } from "@/components/ui/button";
import { Heart, Plus } from "lucide-react";

export function EmptyState() {
  const { openCreateModal } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="h-16 w-16 rounded-full bg-neutral-100 flex items-center justify-center mb-6">
        <Heart className="h-8 w-8 text-neutral-400" />
      </div>
      <h3 className="text-lg font-medium text-neutral-900 mb-2">No things yet</h3>
      <p className="text-neutral-500 max-w-sm mb-6">
        Start collecting nice things people say about you. It'll brighten your day.
      </p>
      <Button onClick={openCreateModal} className="gap-2">
        <Plus className="h-4 w-4" />
        Add your first thing
      </Button>
    </motion.div>
  );
}