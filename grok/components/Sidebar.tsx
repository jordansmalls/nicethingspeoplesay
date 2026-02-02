// components/Sidebar.tsx
"use client";

import SidebarContent from "./SidebarContent";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen border-r bg-background">
      <SidebarContent />
    </aside>
  );
}