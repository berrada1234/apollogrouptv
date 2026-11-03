"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/form";

type Platform = {
  name: string;
  verified: boolean;
  downloadUrl: string;
  instructions: string;
  method: string;
  downloadLabel: string;
  copyLabel: string;
  copyValue: string;
};

const blank: Platform = { name: "", verified: false, downloadUrl: "", instructions: "", method: "", downloadLabel: "", copyLabel: "", copyValue: "" };

/** App details plus repeatable platform rows; submitted as parallel form fields. */
export function AppsEditor({ initial, appVersion, releaseNotes }: { initial: Platform[]; appVersion: string; releaseNotes: string }) {
  const [rows, setRows] = useState<(Platform & { key: number })[]>(initial.map((p, i) => ({ ...blank, ...p, key: i })));
  const [nextKey, setNextKey] = useState(initial.length);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
        <div>
          <Label htmlFor="appVersion">Current app version</Label>
          <Input id="appVersion" name="appVersion" defaultValue={appVersion} placeholder="e.g. 4.1.0" maxLength={20} />
        </div>
        <div>
          <Label htmlFor="releaseNotes">What&apos;s new (one item per line, “Title — description”)</Label>
          <Textarea id="releaseNotes" name="releaseNotes" rows={3} defaultValue={releaseNotes} maxLength={2000} />
        </div>
      </div>

      {rows.length === 0 && <p className="text-sm text-muted">No platforms configured. Apps &amp; Guides shows a “coming soon” state.</p>}
      {rows.map((row, i) => (
        <fieldset key={row.key} className="space-y-3 rounded-xl border border-border p-4">
          <legend className="px-1 text-xs text-muted">Platform {i + 1}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor={`pn-${row.key}`}>Name</Label>
              <Input id={`pn-${row.key}`} name="name" defaultValue={row.name} placeholder="e.g. Fire TV & Android TV" required maxLength={60} />
            </div>
            <div>
              <Label htmlFor={`pm-${row.key}`}>Install method (short)</Label>
              <Input id={`pm-${row.key}`} name="method" defaultValue={row.method} placeholder="e.g. Official app store · Windows 10/11" maxLength={80} />
            </div>
            <div>
              <Label htmlFor={`pu-${row.key}`}>Official download URL (yours)</Label>
              <Input id={`pu-${row.key}`} name="downloadUrl" type="url" defaultValue={row.downloadUrl} placeholder="https://…" />
            </div>
            <div>
              <Label htmlFor={`pd-${row.key}`}>Download button label</Label>
              <Input id={`pd-${row.key}`} name="downloadLabel" defaultValue={row.downloadLabel} placeholder="e.g. Download installer" maxLength={40} />
            </div>
            <div>
              <Label htmlFor={`pcl-${row.key}`}>Copyable value label (optional)</Label>
              <Input id={`pcl-${row.key}`} name="copyLabel" defaultValue={row.copyLabel} placeholder="e.g. Downloader code or Server URL" maxLength={40} />
            </div>
            <div>
              <Label htmlFor={`pcv-${row.key}`}>Copyable value</Label>
              <Input id={`pcv-${row.key}`} name="copyValue" defaultValue={row.copyValue} maxLength={200} />
            </div>
          </div>
          <div>
            <Label htmlFor={`pi-${row.key}`}>Installation steps (one per line)</Label>
            <Textarea id={`pi-${row.key}`} name="instructions" rows={4} defaultValue={row.instructions} maxLength={2000} />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-muted">
              <input type="checkbox" name="verified" value={String(i)} defaultChecked={row.verified} className="h-4 w-4 accent-primary" />
              Compatibility verified (only verified platforms are shown to customers)
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
          setRows((r) => [...r, { ...blank, key: nextKey }]);
          setNextKey((k) => k + 1);
        }}
      >
        <Plus className="h-4 w-4" aria-hidden /> Add platform
      </Button>
    </div>
  );
}
