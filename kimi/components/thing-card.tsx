// components/thing-card.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAppStore } from "@/stores/useAppStore";
import { Thing } from "@/types";
import { formatDate } from "@/lib/utils";

interface ThingCardProps {
  thing: Thing;
  index?: number;
}

export function ThingCard({ thing, index = 0 }: ThingCardProps) {
  const { openEditModal, openDeleteModal } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="group relative rounded-lg border border-neutral-200 bg-white p-5 hover:border-neutral-300 transition-colors"
    >
      <Link href={`/things/${thing._id}`} className="block space-y-3">
        <p className="text-neutral-900 line-clamp-2">"{thing.thing}"</p>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-neutral-700">{thing.who}</span>
          <span className="text-neutral-400">{formatDate(thing.createdAt)}</span>
        </div>
      </Link>
    </motion.div>
  );
}