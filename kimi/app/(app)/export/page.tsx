// app/(app)/export/page.tsx
"use client";

import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAppStore } from "@/stores/useAppStore";
import { exportThings } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Download, FileJson, FileText, Loader2 } from "lucide-react";

export default function ExportPage() {
  const { exportFormat, setExportFormat, isExporting, setExporting } = useAppStore();

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportThings(exportFormat);
      toast.success(`Exported as ${exportFormat.toUpperCase()}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-semibold tracking-tight">Export</h1>
        <p className="text-neutral-500">Download your things</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="max-w-md"
      >
        <Card>
          <CardHeader>
            <CardTitle>Export format</CardTitle>
            <CardDescription>Choose how you want to download your data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={exportFormat}
              onValueChange={(v) => setExportFormat(v as "json" | "txt")}
              className="grid gap-4"
            >
              <div>
                <RadioGroupItem value="json" id="json" className="peer sr-only" />
                <Label
                  htmlFor="json"
                  className="flex items-center gap-4 rounded-lg border border-neutral-200 p-4 hover:bg-neutral-50 peer-data-[state=checked]:border-neutral-900 peer-data-[state=checked]:bg-neutral-50 cursor-pointer"
                >
                  <FileJson className="h-8 w-8 text-neutral-600" />
                  <div className="flex-1">
                    <p className="font-medium">JSON</p>
                    <p className="text-sm text-neutral-500">Machine-readable format</p>
                  </div>
                </Label>
              </div>

              <div>
                <RadioGroupItem value="txt" id="txt" className="peer sr-only" />
                <Label
                  htmlFor="txt"
                  className="flex items-center gap-4 rounded-lg border border-neutral-200 p-4 hover:bg-neutral-50 peer-data-[state=checked]:border-neutral-900 peer-data-[state=checked]:bg-neutral-50 cursor-pointer"
                >
                  <FileText className="h-8 w-8 text-neutral-600" />
                  <div className="flex-1">
                    <p className="font-medium">Plain text</p>
                    <p className="text-sm text-neutral-500">Human-readable format</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            <Button onClick={handleExport} disabled={isExporting} className="w-full gap-2">
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Export {exportFormat.toUpperCase()}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}