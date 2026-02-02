// app/(app)/things/page.tsx
"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/stores/useAppStore";
import { getAllThings, deleteAllThings } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ThingCard } from "@/components/thing-card";
import { EmptyState } from "@/components/empty-state";
import { CreateThingDialog } from "@/components/create-thing-dialog";
import { EditThingDialog } from "@/components/edit-thing-dialog";
import { DeleteThingDialog } from "@/components/delete-thing-dialog";
import { Plus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function ThingsPage() {
  const {
    things,
    isThingsLoading,
    setThings,
    clearThings,
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

  const handleDeleteAll = async () => {
    if (!confirm("Are you sure? This will delete all your things permanently.")) {
      return;
    }
    try {
      await deleteAllThings();
      clearThings();
      toast.success("All things deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete all");
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Things</h1>
          <p className="text-neutral-500">All your collected nice things</p>
        </div>
        <div className="flex gap-2">
          {things.length > 0 && (
            <Button variant="outline" onClick={handleDeleteAll} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Delete all
            </Button>
          )}
          <Button onClick={openCreateModal} className="gap-2">
            <Plus className="h-4 w-4" />
            Add thing
          </Button>
        </div>
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
          className="space-y-3"
        >
          {things.map((thing, index) => (
            <ThingCard key={thing._id} thing={thing} index={index} />
          ))}
        </motion.div>
      )}

      <CreateThingDialog />
      <EditThingDialog />
      <DeleteThingDialog />
    </div>
  );
}