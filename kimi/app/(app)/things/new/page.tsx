// app/(app)/things/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAppStore } from "@/stores/useAppStore";
import { createThing } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewThingPage() {
  const router = useRouter();
  const addThing = useAppStore((state) => state.addThing);
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
      toast.success("Thing added successfully");
      router.push("/things");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create thing");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
                <Link
          href="/things"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to things
        </Link>

        <h1 className="text-2xl font-semibold tracking-tight">Add new thing</h1>
        <p className="text-neutral-500">Record something nice someone said</p>
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
            placeholder="You always make people feel welcome..."
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
            placeholder="Alice"
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
            placeholder="Because I'm new here and you helped me..."
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
            <Link href="/things">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isLoading} className="gap-2">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Save thing
          </Button>
        </div>
      </motion.form>
    </div>
  );
}