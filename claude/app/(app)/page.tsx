"use client"

import { useEffect } from "react"
import { useAppStore } from "@/stores/useAppStore"
import { getAllThings } from "@/lib/api"
import { formatDate } from "@/lib/utils"
import { Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export default function DashboardPage() {
  const { things, setThings, setThingsLoading } = useAppStore()

  useEffect(() => {
    const loadThings = async () => {
      try {
        setThingsLoading(true)
        const data = await getAllThings()
        setThings(data)
      } catch (error: any) {
        // Silently fail, user will see empty state
      } finally {
        setThingsLoading(false)
      }
    }

    loadThings()
  }, [setThings, setThingsLoading])

  const recentThings = things.slice(0, 5)
  const totalThings = things.length

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back. Here's what people have been saying.
        </p>
      </motion.div>

      <motion.div
        className="grid gap-4 md:grid-cols-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-medium">Total Things</h3>
          </div>
          <p className="mt-4 text-4xl font-semibold">{totalThings}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Nice things collected
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-medium">Recent Activity</h3>
          <p className="mt-4 text-4xl font-semibold">
            {recentThings.length > 0
              ? formatDate(recentThings[0].createdAt)
              : "—"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Last thing added
          </p>
        </div>
      </motion.div>

      {recentThings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="mb-4 text-lg font-medium">Recent Things</h2>
          <div className="space-y-3">
            {recentThings.map((thing, index) => (
              <motion.div
                key={thing._id}
                className="rounded-lg border bg-card p-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
              >
                <p className="font-medium">{thing.thing}</p>
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>— {thing.who}</span>
                  <span>•</span>
                  <span>{formatDate(thing.createdAt)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {totalThings === 0 && (
        <motion.div
          className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Sparkles className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No things yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Start collecting nice things people say
          </p>
        </motion.div>
      )}
    </div>
  )
}