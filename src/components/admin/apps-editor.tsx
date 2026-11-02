"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/form";

type Platform = { name: string; verified: boolean; downloadUrl: string; instructions: string };

/** Repeatable rows for supported app platforms; submitted as parallel form fields. */
export function AppsEditor({ initial }: { initial: Platform[] }) {
  const [rows, setRows] = useState<(Platform & { key: number })[]>(initial.map((p, i) => ({ ...p, key: i })));
  const [nextKey, setNextKey] = useState(initial.length);

  return (
    <div className="space-y-4">
      {rows.length === 0 && <p className="text-sm text-muted">No platforms configured. The App page shows a “coming soon” state.</p>}
      {rows.map((row, i) => (
        <fieldset key={row.key} className="space-y-3 rounded-xl border border-border p-4">
          <legend className="px-1 text-xs text-muted">Platform {i + 1}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor={`pn-${row.key}`}>Name</Label>
              <Input id={`pn-${row.key}`} name="name" defaultValue={row.name} placeholder="e.g. Android TV" required maxLength={60} />
            </div>
            <div>
              <Label htmlFor={`pu-${row.key}`}>Official download URL</Label>
              <Input id={`pu-${row.key}`} name="downloadUrl" type="url" defaultValue={row.downloadUrl} placeholder="https://…" />
            </div>
          </div>
          <div>
            <Label htmlFor={`pi-${row.key}`}>Installation steps (one per line)</Label>
            <Textarea id={`pi-${row.key}`} name="instructions" rows={3} defaultValue={row.instructions} maxLength={2000} />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-muted">
              <input type="checkbox" name="verified" value={String(i)} defaultChecked={row.verified} className="h-4 w-4 accent-primary" />
              Compatibility verified (only verified platforms are shown publicly)
            </label>
            <Button type="button" variant="ghost" size="sm" onClick={() => setRows((r) => r.filter((x) => x.key !== row.key))}>
              <Trash2 className="h-4 w-4" aria-hidden /> Remove
            </Button>
          </div>
        </fieldset>
      ))}
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => {
          setRows((r) => [...r, { key: nextKey, name: "", verified: false, downloadUrl: "", instructions: "" }]);
          setNextKey((k) => k + 1);
        }}
      >
        <Plus className="h-4 w-4" aria-hidden /> Add platform
      </Button>
    </div>
  );
}
