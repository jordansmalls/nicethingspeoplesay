// app/(app)/things/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAppStore } from "@/stores/useAppStore";
import { getThing, updateThing } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft } from "lucide-react";

export default function EditThingPage() {
  const params = useParams();
  const router = useRouter();
  const { updateThingInState } = useAppStore();
  const [thing, setThing] = useState("");
  const [who, setWho] = useState("");
  const [why, setWhy] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadThing = async () => {
      try {
        const data = await getThing(params.id as string);
        setThing(data.thing);
        setWho(data.who);
        setWhy(data.why || "");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Thing not found");
        router.push("/things");
      } finally {
        setIsLoading(false);
      }
    };
    loadThing();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const updated = await updateThing(params.id as string, {
        thing: thing.trim(),
        who: who.trim(),
        why: why.trim() || undefined,
      });
      updateThingInState(updated);
      toast.success("Thing updated successfully");
      router.push(`/things/${params.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update thing");
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          href={`/things/${params.id}`}
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to thing
        </Link>

        <h1 className="text-2xl font-semibold tracking-tight">Edit thing</h1>
        <p className="text-neutral-500">Update this nice thing</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        onSubmit={handleSubmit}
        className="space-y-6 max-w-lg"
      >
        <div className="space-y-2">
          <Label htmlFor="thing">What did they say? *</Label>
          <Textarea
            id="thing"
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
          <Label htmlFor="who">Who said it? *</Label>
          <Input
            id="who"
            value={who}
            onChange={(e) => setWho(e.target.value)}
            required
            maxLength={100}
          />
          <p className="text-xs text-neutral-500">{who.length}/100</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="why">Context (optional)</Label>
          <Textarea
            id="why"
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            maxLength={1000}
            rows={3}
            className="resize-none"
          />
          <p className="text-xs text-neutral-500">{why.length}/1000</p>
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="outline" asChild>
            <Link href={`/things/${params.id}`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSaving} className="gap-2">
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </div>
      </motion.form>
    </div>
  );
}