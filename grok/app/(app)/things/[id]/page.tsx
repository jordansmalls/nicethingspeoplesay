// app/(app)/things/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { getThing } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";

export default function ViewThingPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { selectedThing, setSelectedThing, openEditModal, openDeleteModal } = useAppStore();

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getThing(id);
        setSelectedThing(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load thing");
        router.push("/things");
      }
    };

    if (!selectedThing || selectedThing._id !== id) {
      fetch();
    }
  }, [id, selectedThing, setSelectedThing, router]);

  if (!selectedThing || selectedThing._id !== id) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{selectedThing.thing}</h1>
        <div className="space-x-2">
          <Button onClick={() => openEditModal(selectedThing)}>Edit</Button>
          <Button variant="destructive" onClick={() => openDeleteModal(selectedThing)}>Delete</Button>
        </div>
      </div>
      <p><strong>Who:</strong> {selectedThing.who}</p>
      <p><strong>Why:</strong> {selectedThing.why || "N/A"}</p>
      <p><strong>Created At:</strong> {format(new Date(selectedThing.createdAt), "PPP p")}</p>
      <p><strong>Updated At:</strong> {format(new Date(selectedThing.updatedAt), "PPP p")}</p>
    </div>
  );
}