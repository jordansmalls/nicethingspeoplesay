// components/delete-thing-dialog.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAppStore } from "@/stores/useAppStore";
import { deleteThing } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";

export function DeleteThingDialog() {
  const {
    isDeleteModalOpen,
    closeDeleteModal,
    selectedThing,
    removeThing,
  } = useAppStore();

  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!selectedThing) return;

    setIsLoading(true);
    try {
      await deleteThing(selectedThing._id);
      removeThing(selectedThing._id);
      toast.success("Thing deleted");
      closeDeleteModal();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete thing");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      closeDeleteModal();
    }
  };

  return (
    <Dialog open={isDeleteModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete this thing?
          </DialogTitle>
          <DialogDescription>
            "{selectedThing?.thing.slice(0, 60)}
            {selectedThing && selectedThing.thing.length > 60 ? "..." : ""}"
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}