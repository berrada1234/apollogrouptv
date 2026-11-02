import { Search } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function DataTable({ head, children, minWidth = 720 }: { head: string[]; children: React.ReactNode; minWidth?: number }) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth }}>
          <thead className="border-b border-border bg-inset/60 text-left text-[11px] uppercase tracking-[0.08em] text-subtle">
            <tr>
              {head.map((h) => (
                <th key={h} scope="col" className="whitespace-nowrap px-4 py-3 font-semibold first:pl-5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&>tr]:border-b [&>tr]:border-border [&>tr]:transition-colors [&>tr:hover]:bg-card-hover/60 [&>tr:last-child]:border-0">{children}</tbody>
        </table>
      </div>
    </Card>
  );
}

export function Td({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-4 py-3 align-middle first:pl-5", className)} {...props} />;
}

export function EmptyRow({ colSpan, children }: { colSpan: number; children: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-14 text-center text-sm text-muted">
        {children}
      </td>
    </tr>
  );
}

/** GET form for search/filter bars — works without JavaScript. */
export function FilterBar({ children }: { children: React.ReactNode }) {
  return (
    <form method="get" role="search" className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-card sm:flex-row sm:flex-wrap sm:items-end">
      {children}
      <div className="flex gap-2">
        <button type="submit" className={buttonClasses({ className: "flex-1 sm:flex-none" })}>
          <Search className="h-4 w-4" aria-hidden /> Apply
        </button>
        <a href="?" className={buttonClasses({ variant: "ghost" })}>
          Reset
        </a>
      </div>
    </form>
  );
}
