"use client";

import { Button } from "./Button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  pageSize?: number;
  total?: number;
}

export function Pagination({ page, totalPages, onPageChange, className, pageSize, total }: PaginationProps) {
  if (totalPages <= 1 && total === undefined) return null;

  return (
    <div
      className={cn(
        "flex flex-col-reverse items-center justify-between gap-3 sm:flex-row",
        className
      )}
    >
      {total !== undefined && pageSize !== undefined && (
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{(page - 1) * pageSize + 1}</span>
          –<span className="font-medium text-foreground">{Math.min(page * pageSize, total)}</span> de{" "}
          <span className="font-medium text-foreground">{total}</span>
        </p>
      )}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
          aria-label="Primeira página"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Anterior</span>
        </Button>
        <span className="px-2 text-sm tabular-nums text-muted-foreground">
          <span className="font-medium text-foreground">{page}</span> / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          <span className="hidden sm:inline">Próxima</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages}
          aria-label="Última página"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
