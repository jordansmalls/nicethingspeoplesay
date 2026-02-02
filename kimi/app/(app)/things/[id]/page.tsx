// app/(app)/things/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAppStore } from "@/stores/useAppStore";
import { getThing, deleteThing } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ThingPage() {
  const params = useParams();
  const router = useRouter();
  const { removeThing, openEditModal, openDeleteModal } = useAppStore();
  const [thing, setThing] = useState<ReturnType<typeof useAppStore.getState>["selectedThing"]>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadThing = async () => {
      try {
        const data = await getThing(params.id as string);
        setThing(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Thing not found");
        router.push("/things");
      } finally {
        setIsLoading(false);
      }
    };
    loadThing();
  }, [params.id, router]);

  const handleDelete = async () => {
    if (!thing) return;
    if (!confirm("Are you sure you want to delete this thing?")) return;

    try {
      await deleteThing(thing._id);
      removeThing(thing._id);
      toast.success("Thing deleted");
      router.push("/things");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!thing) return null;

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
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="space-y-6"
      >
        <div className="rounded-lg border border-neutral-200 bg-white p-6 md:p-8">
          <blockquote className="text-xl md:text-2xl font-medium leading-relaxed text-neutral-900 mb-6">
            "{thing.thing}"
          </blockquote>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-neutral-500">From:</span>
              <span className="font-medium">{thing.who}</span>
            </div>

            {thing.why && (
              <div className="text-sm text-neutral-600">
                <span className="text-neutral-500">Context: </span>
                {thing.why}
              </div>
            )}

            <div className="pt-4 border-t border-neutral-100 text-xs text-neutral-400">
              Added {formatDate(thing.createdAt)}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href={`/things/${thing._id}/edit`}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button variant="outline" className="text-red-600 hover:text-red-700" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </motion.div>
    </div>
  );
}