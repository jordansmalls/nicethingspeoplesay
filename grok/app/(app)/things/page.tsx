// app/(app)/things/page.tsx
"use client";

import { useAppStore } from "@/stores/useAppStore";
import { useEffect, useState } from "react";
import { getAllThings, deleteAllThings } from "@/lib/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { format } from "date-fns";

export default function ThingsPage() {
  const { things, setThings, addThing, updateThingInState, removeThing, clearThings, isThingsLoading, openCreateModal, openEditModal, openDeleteModal } = useAppStore();
  const [deleteAllOpen, setDeleteAllOpen] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAllThings();
        setThings(data);
      } catch {}
    };

    if (things.length === 0 && !isThingsLoading) {
      fetch();
    }
  }, [things, isThingsLoading, setThings]);

  const handleDeleteAll = async () => {
    setDeletingAll(true);
    try {
      await deleteAllThings();
      clearThings();
      toast("All things deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete all things");
    } finally {
      setDeletingAll(false);
      setDeleteAllOpen(false);
    }
  };

  if (isThingsLoading) {
    return <div>Loading...</div>;
  }

  if (things.length === 0) {
    return (
      <div className="text-center py-10 space-y-4">
        <p className="text-muted-foreground">No things yet.</p>
        <Button onClick={openCreateModal}>Add your first thing</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Things</h1>
        <Button onClick={openCreateModal}>New Thing</Button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Thing</th>
            <th className="text-left py-2">Who</th>
            <th className="text-left py-2">Why</th>
            <th className="text-left py-2">Created</th>
            <th className="text-left py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {things.map((thing) => (
            <tr key={thing._id} className="border-b">
              <td className="py-2">{thing.thing}</td>
              <td className="py-2">{thing.who}</td>
              <td className="py-2">{thing.why || "-"}</td>
              <td className="py-2">{format(new Date(thing.createdAt), "PPP")}</td>
              <td className="py-2 space-x-2">
                <Link href={`/things/${thing._id}`} className="text-blue-500">View</Link>
                <Button variant="link" onClick={() => openEditModal(thing)}>Edit</Button>
                <Button variant="link" onClick={() => openDeleteModal(thing)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button variant="destructive" onClick={() => setDeleteAllOpen(true)}>Delete All</Button>
      <Dialog open={deleteAllOpen} onOpenChange={setDeleteAllOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete All Things?</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete all things? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteAllOpen(false)}>Cancel</Button>
            <Button variant="destructive" disabled={deletingAll} onClick={handleDeleteAll}>
              {deletingAll ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}