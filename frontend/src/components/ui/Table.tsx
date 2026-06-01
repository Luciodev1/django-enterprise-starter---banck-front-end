import { cn } from "@/lib/utils";

interface TableProps {
  className?: string;
  children: React.ReactNode;
}

export function Table({ className, children }: TableProps) {
  return (
    <div className="relative w-full overflow-auto">
      <table className={cn("w-full caption-bottom text-sm", className)}>{children}</table>
    </div>
  );
}

export function TableHeader({ className, children }: TableProps) {
  return <thead className={cn("[&_tr]:border-b", className)}>{children}</thead>;
}

export function TableBody({ className, children }: TableProps) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)}>{children}</tbody>;
}

export function TableRow({ className, children }: TableProps) {
  return (
    <tr className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)}>
      {children}
    </tr>
  );
}

export function TableHead({ className, children }: TableProps) {
  return (
    <th className={cn("h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", className)}>
      {children}
    </th>
  );
}

export function TableCell({ className, children }: TableProps) {
  return <td className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}>{children}</td>;
}
