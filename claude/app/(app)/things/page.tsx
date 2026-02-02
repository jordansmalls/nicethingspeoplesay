"use client"

import { useEffect, useState } from "react"
import { useAppStore } from "@/stores/useAppStore"
import {
  getAllThings,
  createThing,
  updateThing,
  deleteThing,
} from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatDate } from "@/lib/utils"
import { Plus, Pencil, Trash2, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"

export default function ThingsPage() {
  const {
    things,
    setThings,
    setThingsLoading,
    isThingsLoading,
    isMutatingThing,
    setMutatingThing,
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    selectedThing,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    addThing,
    updateThingInState,
    removeThing,
  } = useAppStore()

  const [formData, setFormData] = useState({
    thing: "",
    who: "",
    why: "",
  })

  useEffect(() => {
    const loadThings = async () => {
      try {
        setThingsLoading(true)
        const data = await getAllThings()
        setThings(data)
      } catch (error: any) {
        toast.error(error.message || "Failed to load things")
      } finally {
        setThingsLoading(false)
      }
    }

    loadThings()
  }, [setThings, setThingsLoading])

  useEffect(() => {
    if (isEditModalOpen && selectedThing) {
      setFormData({
        thing: selectedThing.thing,
        who: selectedThing.who,
        why: selectedThing.why || "",
      })
    }
  }, [isEditModalOpen, selectedThing])

  const handleCreateThing = async () => {
    if (!formData.thing.trim() || !formData.who.trim()) {
      toast.error("Please fill in required fields")
      return
    }

    try {
      setMutatingThing(true)
      const newThing = await createThing({
        thing: formData.thing.trim(),
        who: formData.who.trim(),
        why: formData.why.trim() || undefined,
      })
      addThing(newThing)
      toast.success("Thing created successfully")
      closeCreateModal()
      setFormData({ thing: "", who: "", why: "" })
    } catch (error: any) {
      toast.error(error.message || "Failed to create thing")
    } finally {
      setMutatingThing(false)
    }
  }

  const handleUpdateThing = async () => {
    if (!selectedThing || !formData.thing.trim() || !formData.who.trim()) {
      toast.error("Please fill in required fields")
      return
    }

    try {
      setMutatingThing(true)
      const updatedThing = await updateThing(selectedThing._id, {
        thing: formData.thing.trim(),
        who: formData.who.trim(),
        why: formData.why.trim() || undefined,
      })
      updateThingInState(updatedThing)
      toast.success("Thing updated successfully")
      closeEditModal()
      setFormData({ thing: "", who: "", why: "" })
    } catch (error: any) {
      toast.error(error.message || "Failed to update thing")
    } finally {
      setMutatingThing(false)
    }
  }

  const handleDeleteThing = async () => {
    if (!selectedThing) return

    try {
      setMutatingThing(true)
      await deleteThing(selectedThing._id)
      removeThing(selectedThing._id)
      toast.success("Thing deleted successfully")
      closeDeleteModal()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete thing")
    } finally {
      setMutatingThing(false)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Things</h1>
          <p className="mt-2 text-muted-foreground">
            All the nice things people have said.
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Thing
        </Button>
      </motion.div>

      {isThingsLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      ) : things.length === 0 ? (
        <motion.div
          className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Sparkles className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No things yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Get started by creating your first thing
          </p>
          <Button onClick={openCreateModal} className="mt-6">
            <Plus className="mr-2 h-4 w-4" />
            Add your first thing
          </Button>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {things.map((thing, index) => (
            <motion.div
              key={thing._id}
              className="group rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <p className="font-medium leading-relaxed">{thing.thing}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>— {thing.who}</span>
                    <span>•</span>
                    <span>{formatDate(thing.createdAt)}</span>
                  </div>
                  {thing.why && (
                    <p className="text-sm text-muted-foreground">
                      {thing.why}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditModal(thing)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteModal(thing)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={closeCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Thing</DialogTitle>
            <DialogDescription>
              Record a nice thing someone said to you
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="thing">What they said *</Label>
              <Textarea
                id="thing"
                placeholder="You always make people feel welcome"
                value={formData.thing}
                onChange={(e) =>
                  setFormData({ ...formData, thing: e.target.value })
                }
                maxLength={500}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="who">Who said it *</Label>
              <Input
                id="who"
                placeholder="Alice"
                value={formData.who}
                onChange={(e) =>
                  setFormData({ ...formData, who: e.target.value })
                }
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="why">Context (optional)</Label>
              <Textarea
                id="why"
                placeholder="Because I'm new here"
                value={formData.why}
                onChange={(e) =>
                  setFormData({ ...formData, why: e.target.value })
                }
                maxLength={1000}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeCreateModal}
              disabled={isMutatingThing}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateThing} disabled={isMutatingThing}>
              {isMutatingThing ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={closeEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Thing</DialogTitle>
            <DialogDescription>
              Update the details of this thing
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-thing">What they said *</Label>
              <Textarea
                id="edit-thing"
                value={formData.thing}
                onChange={(e) =>
                  setFormData({ ...formData, thing: e.target.value })
                }
                maxLength={500}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-who">Who said it *</Label>
              <Input
                id="edit-who"
                value={formData.who}
                onChange={(e) =>
                  setFormData({ ...formData, who: e.target.value })
                }
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-why">Context (optional)</Label>
              <Textarea
                id="edit-why"
                value={formData.why}
                onChange={(e) =>
                  setFormData({ ...formData, why: e.target.value })
                }
                maxLength={1000}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeEditModal}
              disabled={isMutatingThing}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateThing} disabled={isMutatingThing}>
              {isMutatingThing ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={closeDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Thing</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this thing? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          {selectedThing && (
            <div className="rounded-lg border bg-muted p-4">
              <p className="font-medium">{selectedThing.thing}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                — {selectedThing.who}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDeleteModal}
              disabled={isMutatingThing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteThing}
              disabled={isMutatingThing}
            >
              {isMutatingThing ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}