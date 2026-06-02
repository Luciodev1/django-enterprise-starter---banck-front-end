import { cn } from "@/lib/utils";

interface TableProps {
  className?: string;
  children: React.ReactNode;
}

export function Table({ className, children }: TableProps) {
  return (
    <div className="relative w-full overflow-x-auto rounded-lg">
      <table className={cn("w-full caption-bottom text-sm", className)}>{children}</table>
    </div>
  );
}

export function TableHeader({ className, children }: TableProps) {
  return (
    <thead
      className={cn(
        "border-b border-border bg-muted/40 [&_tr]:border-b",
        className
      )}
    >
      {children}
    </thead>
  );
}

export function TableBody({ className, children }: TableProps) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)}>{children}</tbody>;
}

export function TableRow({ className, children }: TableProps) {
  return (
    <tr
      className={cn(
        "border-b border-border/60 transition-colors hover:bg-muted/40 data-[state=selected]:bg-muted",
        className
      )}
    >
      {children}
    </tr>
  );
}

export function TableHead({ className, children }: TableProps) {
  return (
    <th
      className={cn(
        "h-11 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wider text-muted-foreground",
        "[&:has([role=checkbox])]:pr-0",
        className
      )}
    >
      {children}
    </th>
  );
}

export function TableCell({ className, children }: TableProps) {
  return (
    <td
      className={cn(
        "p-4 align-middle text-sm text-foreground/90 [&:has([role=checkbox])]:pr-0",
        className
      )}
    >
      {children}
    </td>
  );
}
