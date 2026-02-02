"use client"

import { useEffect, useState } from "react"
import { useAppStore } from "@/stores/useAppStore"
import { getAllThings, exportThings, deleteAllThings } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Download, FileJson, FileText, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"

export default function ExportPage() {
  const {
    things,
    setThings,
    clearThings,
    setThingsLoading,
    isExporting,
    setExporting,
  } = useAppStore()

  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false)
  const [isDeletingAll, setIsDeletingAll] = useState(false)

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

  const handleExport = async (format: "json" | "txt") => {
    try {
      setExporting(true)
      await exportThings(format)
      toast.success(`Export completed as ${format.toUpperCase()}`)
    } catch (error: any) {
      toast.error(error.message || "Export failed")
    } finally {
      setExporting(false)
    }
  }

  const handleDeleteAll = async () => {
    try {
      setIsDeletingAll(true)
      await deleteAllThings()
      clearThings()
      toast.success("All things deleted successfully")
      setShowDeleteAllDialog(false)
    } catch (error: any) {
      toast.error(error.message || "Failed to delete all things")
    } finally {
      setIsDeletingAll(false)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-semibold tracking-tight">Export</h1>
        <p className="mt-2 text-muted-foreground">
          Download your data or manage your collection
        </p>
      </motion.div>

      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-medium">Export Your Data</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Download all your things in your preferred format
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <button
              onClick={() => handleExport("json")}
              disabled={isExporting || things.length === 0}
              className="flex flex-col items-center justify-center rounded-lg border bg-background p-6 transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FileJson className="h-8 w-8 text-muted-foreground" />
              <h3 className="mt-3 font-medium">JSON Format</h3>
              <p className="mt-1 text-center text-sm text-muted-foreground">
                Structured data format
              </p>
              <Button
                size="sm"
                className="mt-4"
                disabled={isExporting || things.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                {isExporting ? "Exporting..." : "Export JSON"}
              </Button>
            </button>

            <button
              onClick={() => handleExport("txt")}
              disabled={isExporting || things.length === 0}
              className="flex flex-col items-center justify-center rounded-lg border bg-background p-6 transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FileText className="h-8 w-8 text-muted-foreground" />
              <h3 className="mt-3 font-medium">Text Format</h3>
              <p className="mt-1 text-center text-sm text-muted-foreground">
                Human-readable report
              </p>
              <Button
                size="sm"
                className="mt-4"
                disabled={isExporting || things.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                {isExporting ? "Exporting..." : "Export TXT"}
              </Button>
            </button>
          </div>

          {things.length === 0 && (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              No things to export yet
            </p>
          )}
        </div>

        <div className="rounded-lg border border-destructive/50 bg-card p-6">
          <h2 className="text-lg font-medium text-destructive">Danger Zone</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Irreversible actions that affect all your data
          </p>

          <div className="mt-6">
            <Button
              variant="destructive"
              onClick={() => setShowDeleteAllDialog(true)}
              disabled={things.length === 0}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete All Things
            </Button>
            {things.length === 0 && (
              <p className="mt-2 text-sm text-muted-foreground">
                No things to delete
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Delete All Confirmation Dialog */}
      <Dialog open={showDeleteAllDialog} onOpenChange={setShowDeleteAllDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete All Things</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete all {things.length} thing
              {things.length !== 1 ? "s" : ""}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border-2 border-destructive bg-destructive/10 p-4">
            <p className="font-medium text-destructive">
              This will permanently delete all your data
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Consider exporting your data first
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteAllDialog(false)}
              disabled={isDeletingAll}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAll}
              disabled={isDeletingAll}
            >
              {isDeletingAll ? "Deleting..." : "Delete All"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}