// app/(app)/things/new/page.tsx
"use client";

import ThingForm from "@/components/ThingForm";

export default function NewThingPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create New Thing</h1>
      <ThingForm />
    </div>
  );
}