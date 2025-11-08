import React from "react";
import { classNames } from "./classNames";

export function Spinner({ size = "md", className, ...props }) {
  const sizeClasses = {
    xs: "h-3 w-3 border-2",
    sm: "h-4 w-4 border-2",
    md: "h-5 w-5 border-2",
    lg: "h-6 w-6 border-[3px]",
  };

  return (
    <span
      role="status"
      aria-live="polite"
      className={classNames("inline-flex", className)}
      {...props}
    >
      <span
        className={classNames(
          "inline-block animate-spin rounded-full border-current border-t-transparent text-current",
          sizeClasses[size] ?? sizeClasses.md
        )}
      >
        <span className="sr-only">Cargando</span>
      </span>
    </span>
  );
}
