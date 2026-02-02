// components/CreateThingModal.tsx
"use client";

import { useState } from "react";
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
import { createThing } from "@/lib/api";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function CreateThingModal() {
  const { isCreateModalOpen, closeCreateModal, addThing, isMutatingThing } = useAppStore();
  const [thing, setThing] = useState("");
  const [who, setWho] = useState("");
  const [why, setWhy] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thing.trim() || !who.trim()) return;

    setLoading(true);
    const optimisticId = `temp-${Date.now()}`;
    const optimisticThing = {
      _id: optimisticId,
      thing: thing.trim(),
      who: who.trim(),
      why: why.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addThing(optimisticThing);

    try {
      const created = await createThing({
        thing: thing.trim(),
        who: who.trim(),
        why: why.trim() || undefined,
      });
      // Replace optimistic with real
      useAppStore.getState().removeThing(optimisticId);
      useAppStore.getState().addThing(created);
      toast.success("Thing created successfully");
      closeCreateModal();
      setThing("");
      setWho("");
      setWhy("");
    } catch (err: any) {
      toast.error(err.message || "Failed to create thing");
      // Rollback optimistic update
      useAppStore.getState().removeThing(optimisticId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isCreateModalOpen} onOpenChange={closeCreateModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Nice Thing</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="thing">What nice thing was said?</Label>
            <Input
              id="thing"
              value={thing}
              onChange={(e) => setThing(e.target.value)}
              placeholder="You always make people feel welcome."
              required
              maxLength={500}
            />
          </div>
          <div>
            <Label htmlFor="who">Who said it?</Label>
            <Input
              id="who"
              value={who}
              onChange={(e) => setWho(e.target.value)}
              placeholder="Alice"
              required
              maxLength={100}
            />
          </div>
          <div>
            <Label htmlFor="why">Why does it matter? (optional)</Label>
            <Textarea
              id="why"
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              placeholder="Because I'm new here and it made my day..."
              maxLength={1000}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeCreateModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || isMutatingThing}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}