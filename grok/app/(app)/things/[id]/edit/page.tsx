// app/(app)/things/[id]/edit/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { getThing } from "@/lib/api";
import ThingForm from "@/components/ThingForm";
import { toast } from "sonner";

export default function EditThingPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { selectedThing, setSelectedThing } = useAppStore();

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
      <h1 className="text-2xl font-bold">Edit Thing</h1>
      <ThingForm initialThing={selectedThing} />
    </div>
  );
}