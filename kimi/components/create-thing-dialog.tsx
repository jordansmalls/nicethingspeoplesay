// components/create-thing-dialog.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppStore } from "@/stores/useAppStore";
import { createThing } from "@/lib/api";
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

export function CreateThingDialog() {
  const router = useRouter();
  const { isCreateModalOpen, closeCreateModal, addThing } = useAppStore();
  const [thing, setThing] = useState("");
  const [who, setWho] = useState("");
  const [why, setWhy] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newThing = await createThing({
        thing: thing.trim(),
        who: who.trim(),
        why: why.trim() || undefined,
      });
      addThing(newThing);
      toast.success("Thing added");
      closeCreateModal();
      setThing("");
      setWho("");
      setWhy("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create thing");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      closeCreateModal();
    }
  };

  return (
    <Dialog open={isCreateModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add new thing</DialogTitle>
            <DialogDescription>Record something nice someone said about you</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-thing">What did they say? *</Label>
              <Textarea
                id="create-thing"
                value={thing}
                onChange={(e) => setThing(e.target.value)}
                required
                maxLength={500}
                rows={3}
                className="resize-none"
                placeholder="You always make people feel welcome..."
              />
              <p className="text-xs text-neutral-500">{thing.length}/500</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-who">Who said it? *</Label>
              <Input
                id="create-who"
                value={who}
                onChange={(e) => setWho(e.target.value)}
                required
                maxLength={100}
                placeholder="Alice"
              />
              <p className="text-xs text-neutral-500">{who.length}/100</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-why">Context (optional)</Label>
              <Textarea
                id="create-why"
                value={why}
                onChange={(e) => setWhy(e.target.value)}
                maxLength={1000}
                rows={2}
                className="resize-none"
                placeholder="Because I'm new here..."
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
              Add thing
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}