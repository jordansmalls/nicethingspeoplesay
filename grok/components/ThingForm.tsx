// components/ThingForm.tsx
"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/stores/useAppStore";
import { createThing, updateThing } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  initialThing?: {
    _id: string;
    thing: string;
    who: string;
    why?: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  onSuccess?: () => void;
}

export default function ThingForm({ initialThing = null, onSuccess }: Props) {
  const router = useRouter();
  const { addThing, updateThingInState, removeThing } = useAppStore();

  const isEdit = !!initialThing;

  const [thing, setThing] = useState(initialThing?.thing || "");
  const [who, setWho] = useState(initialThing?.who || "");
  const [why, setWhy] = useState(initialThing?.why || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!thing.trim() || !who.trim()) {
      toast.error("Thing and Who fields are required");
      return;
    }

    setLoading(true);

    const trimmedData = {
      thing: thing.trim(),
      who: who.trim(),
      why: why.trim() || undefined,
    };

    let tempId: string | undefined;

    try {
      if (isEdit) {
        // Edit mode - optimistic update
        const original = initialThing!;
        const optimistic = {
          ...original,
          ...trimmedData,
          updatedAt: new Date().toISOString(),
        };

        updateThingInState(optimistic);

        const updated = await updateThing(original._id, trimmedData);
        updateThingInState(updated);
        toast.success("Thing updated successfully");
      } else {
        // Create mode - optimistic insert
        tempId = `optimistic-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const optimistic = {
          ...trimmedData,
          _id: tempId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        addThing(optimistic);

        const created = await createThing(trimmedData);

        // Replace optimistic entry with real data
        removeThing(tempId);
        addThing(created);

        toast.success("Thing created successfully");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/things");
      }
    } catch (err: any) {
      toast.error(err.message || `Failed to ${isEdit ? "update" : "create"} thing`);

      // Rollback optimistic update
      if (isEdit) {
        // For edit: revert to original
        if (initialThing) updateThingInState(initialThing);
      } else if (tempId) {
        // For create: remove the optimistic entry
        removeThing(tempId);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="thing">What nice thing was said?</Label>
        <Input
          id="thing"
          value={thing}
          onChange={(e) => setThing(e.target.value)}
          placeholder="You always make people feel welcome."
          required
          maxLength={500}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="who">Who said it?</Label>
        <Input
          id="who"
          value={who}
          onChange={(e) => setWho(e.target.value)}
          placeholder="Alice"
          required
          maxLength={100}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="why">Why does it matter? (optional)</Label>
        <Textarea
          id="why"
          value={why}
          onChange={(e) => setWhy(e.target.value)}
          placeholder="Because I'm new here and it made my day..."
          maxLength={1000}
          rows={5}
          disabled={loading}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading
            ? isEdit
              ? "Updating..."
              : "Creating..."
            : isEdit
            ? "Update Thing"
            : "Create Thing"}
        </Button>
      </div>
    </form>
  );
}