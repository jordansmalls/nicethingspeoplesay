// components/EditThingModal.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/stores/useAppStore";
import { updateThing } from "@/lib/api";
import { toast } from "sonner";

export default function EditThingModal() {
  const {
    isEditModalOpen,
    closeEditModal,
    selectedThing,
    updateThingInState,
    isMutatingThing,
  } = useAppStore();

  const [thing, setThing] = useState("");
  const [who, setWho] = useState("");
  const [why, setWhy] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedThing) {
      setThing(selectedThing.thing);
      setWho(selectedThing.who);
      setWhy(selectedThing.why || "");
    }
  }, [selectedThing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedThing || !thing.trim() || !who.trim()) return;

    setLoading(true);

    const original = { ...selectedThing };
    const optimistic = {
      ...selectedThing,
      thing: thing.trim(),
      who: who.trim(),
      why: why.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };

    updateThingInState(optimistic);

    try {
      const updated = await updateThing(selectedThing._id, {
        thing: thing.trim(),
        who: who.trim(),
        why: why.trim() || undefined,
      });
      updateThingInState(updated);
      toast.success("Thing updated");
      closeEditModal();
    } catch (err: any) {
      toast.error(err.message || "Failed to update");
      updateThingInState(original); // rollback
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isEditModalOpen} onOpenChange={closeEditModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Nice Thing</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="thing-edit">What nice thing was said?</Label>
            <Input
              id="thing-edit"
              value={thing}
              onChange={(e) => setThing(e.target.value)}
              required
              maxLength={500}
            />
          </div>
          <div>
            <Label htmlFor="who-edit">Who said it?</Label>
            <Input
              id="who-edit"
              value={who}
              onChange={(e) => setWho(e.target.value)}
              required
              maxLength={100}
            />
          </div>
          <div>
            <Label htmlFor="why-edit">Why does it matter? (optional)</Label>
            <Textarea
              id="why-edit"
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              maxLength={1000}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeEditModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || isMutatingThing}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}