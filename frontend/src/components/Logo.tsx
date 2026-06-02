import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  withText?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { box: "h-7 w-7", text: "text-base", mark: "h-3.5 w-3.5" },
  md: { box: "h-9 w-9", text: "text-lg", mark: "h-4.5 w-4.5" },
  lg: { box: "h-11 w-11", text: "text-xl", mark: "h-5 w-5" },
};

export function Logo({ className, withText = true, size = "md" }: LogoProps) {
  const s = sizes[size];
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "relative inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 via-primary-600 to-indigo-700 text-white shadow-glow",
          s.box
        )}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={cn("text-white", s.mark)}
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 7l8-4 8 4-8 4-8-4z" fill="currentColor" fillOpacity="0.25" />
          <path d="M4 7v10l8 4 8-4V7" />
          <path d="M12 11v10" />
        </svg>
        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-card" />
      </div>
      {withText && (
        <div className="flex flex-col leading-none">
          <span className={cn("font-bold tracking-tight text-foreground", s.text)}>SIS</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Enterprise
          </span>
        </div>
      )}
    </div>
  );
}
