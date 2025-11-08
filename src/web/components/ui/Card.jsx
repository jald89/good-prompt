import React from "react";
import { classNames } from "./classNames";

export const Card = React.forwardRef(function Card(
  { as: Component = "div", className, children, padding = "p-6", ...props },
  ref
) {
  return (
    <Component
      ref={ref}
      className={classNames(
        "rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900",
        padding,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});

export function CardHeader({ className, ...props }) {
  return (
    <div
      className={classNames(
        "mb-4 flex flex-col gap-1 border-b border-slate-100 pb-4 dark:border-slate-800",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={classNames(
        "text-lg font-semibold text-slate-900 dark:text-white",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }) {
  return (
    <p
      className={classNames(
        "text-sm text-slate-500 dark:text-slate-400",
        className
      )}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }) {
  return (
    <div className={classNames("space-y-4", className)} {...props} />
  );
}

export function CardFooter({ className, ...props }) {
  return (
    <div
      className={classNames(
        "mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800",
        className
      )}
      {...props}
    />
  );
}
