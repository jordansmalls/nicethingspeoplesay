// components/DeleteThingModal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/stores/useAppStore";
import { deleteThing } from "@/lib/api";
import { toast } from "sonner";

export default function DeleteThingModal() {
  const {
    isDeleteModalOpen,
    closeDeleteModal,
    selectedThing,
    removeThing,
    isMutatingThing,
  } = useAppStore();

  const handleDelete = async () => {
    if (!selectedThing) return;

    try {
      await deleteThing(selectedThing._id);
      removeThing(selectedThing._id);
      toast.success("Thing deleted");
      closeDeleteModal();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete thing");
    }
  };

  return (
    <Dialog open={isDeleteModalOpen} onOpenChange={closeDeleteModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this nice thing?</DialogTitle>
          <DialogDescription>
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isMutatingThing}
          >
            {isMutatingThing ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}