// components/ui/card.tsx

import * as React from "react";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

function mergeClasses(base: string, extra?: string) {
  return extra ? `${base} ${extra}` : base;
}

/**
 * Simple Card shell used across the admin UI.
 * Styled neutral and professional; override with className when needed.
 */

export function Card({ className, ...props }: DivProps) {
  return (
    <div
      className={mergeClasses(
        "rounded-xl border border-neutral-800 bg-neutral-900/80 text-neutral-50 shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: DivProps) {
  return (
    <div
      className={mergeClasses(
        "px-4 pt-4 pb-2 flex items-center justify-between gap-2",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: DivProps) {
  return (
    <h2
      className={mergeClasses(
        "text-sm font-medium tracking-wide text-neutral-300",
        className
      )}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: DivProps) {
  return (
    <div
      className={mergeClasses("px-4 pb-4 pt-2 space-y-1", className)}
      {...props}
    />
  );
}
