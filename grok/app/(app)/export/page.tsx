// app/(app)/export/page.tsx
"use client";

import { useAppStore } from "@/stores/useAppStore";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { exportThings } from "@/lib/api";

export default function ExportPage() {
  const { exportFormat, setExportFormat, isExporting, setExporting } = useAppStore();

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportThings(exportFormat);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `things.${exportFormat}`;
      a.click();
      URL.revokeObjectURL(url);
      toast("Export successful");
    } catch (err: any) {
      toast.error(err.message || "Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Export</h1>
      <div className="space-y-4">
        <Select value={exportFormat} onValueChange={(value: "json" | "txt") => setExportFormat(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="json">JSON</SelectItem>
            <SelectItem value="txt">TXT</SelectItem>
          </SelectContent>
        </Select>
        <Button disabled={isExporting} onClick={handleExport}>
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </div>
    </div>
  );
}