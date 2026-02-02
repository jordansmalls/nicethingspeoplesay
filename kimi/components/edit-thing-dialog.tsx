// components/edit-thing-dialog.tsx
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAppStore } from "@/stores/useAppStore";
import { updateThing } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

export function EditThingDialog() {
  const {
    isEditModalOpen,
    closeEditModal,
    selectedThing,
    updateThingInState,
  } = useAppStore();

  const [thing, setThing] = useState("");
  const [who, setWho] = useState("");
  const [why, setWhy] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedThing) {
      setThing(selectedThing.thing);
      setWho(selectedThing.who);
      setWhy(selectedThing.why || "");
    }
  }, [selectedThing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedThing) return;

    setIsLoading(true);
    try {
      const updated = await updateThing(selectedThing._id, {
        thing: thing.trim(),
        who: who.trim(),
        why: why.trim() || undefined,
      });
      updateThingInState(updated);
      toast.success("Thing updated");
      closeEditModal();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update thing");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      closeEditModal();
    }
  };

  return (
    <Dialog open={isEditModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit thing</DialogTitle>
            <DialogDescription>Update this nice thing</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-thing">What did they say? *</Label>
              <Textarea
                id="edit-thing"
                value={thing}
                onChange={(e) => setThing(e.target.value)}
                required
                maxLength={500}
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-neutral-500">{thing.length}/500</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-who">Who said it? *</Label>
              <Input
                id="edit-who"
                value={who}
                onChange={(e) => setWho(e.target.value)}
                required
                maxLength={100}
              />
              <p className="text-xs text-neutral-500">{who.length}/100</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-why">Context (optional)</Label>
              <Textarea
                id="edit-why"
                value={why}
                onChange={(e) => setWhy(e.target.value)}
                maxLength={1000}
                rows={2}
                className="resize-none"
              />
              <p className="text-xs text-neutral-500">{why.length}/1000</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}