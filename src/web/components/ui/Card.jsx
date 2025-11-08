import React from "react";
import { classNames } from "./classNames";
import { focusRing } from "./theme";

const cardVariants = {
  elevated:
    "border border-transparent bg-white shadow-lg shadow-slate-900/5 dark:bg-slate-900 dark:shadow-slate-950/40",
  outlined:
    "border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/80",
  muted:
    "border border-slate-100 bg-slate-50 dark:border-slate-800/60 dark:bg-slate-900/60",
};

const toneAccents = {
  primary: "border-indigo-200 dark:border-indigo-500/40",
  neutral: "border-slate-200 dark:border-slate-700",
  success: "border-emerald-200 dark:border-emerald-500/40",
  warning: "border-amber-200 dark:border-amber-500/40",
  danger: "border-rose-200 dark:border-rose-500/40",
};

export const Card = React.forwardRef(function Card(
  {
    as: Component = "div",
    variant = "outlined",
    tone = "neutral",
    interactive = false,
    padding = "p-6",
    className,
    children,
    ...props
  },
  ref
) {
  const isNativeInteractive =
    typeof Component === "string" && ["a", "button"].includes(Component);
  const interactiveProps =
    interactive && !isNativeInteractive
      ? {
          tabIndex: props.tabIndex ?? 0,
          role: props.role ?? (props.onClick ? "button" : "group"),
        }
      : {};

  return (
    <Component
      ref={ref}
      className={classNames(
        "group/card rounded-2xl transition-shadow",
        cardVariants[variant] ?? cardVariants.outlined,
        toneAccents[tone] ?? toneAccents.neutral,
        interactive
          ? "hover:shadow-xl hover:shadow-slate-900/10 focus-visible:shadow-xl focus-visible:shadow-slate-900/10"
          : null,
        interactive ? focusRing : null,
        padding,
        className
      )}
      {...interactiveProps}
      {...props}
    >
      {children}
    </Component>
  );
});

export function CardHeader({ className, spacing = "space-y-1", ...props }) {
  return (
    <div
      className={classNames(
        "border-b border-slate-100 pb-4 dark:border-slate-800",
        spacing,
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, as: Component = "h3", ...props }) {
  return (
    <Component
      className={classNames(
        "text-lg font-semibold text-slate-900 dark:text-white",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, as: Component = "p", ...props }) {
  return (
    <Component
      className={classNames(
        "text-sm text-slate-600 dark:text-slate-300",
        className
      )}
      {...props}
    />
  );
}

export function CardContent({ className, padding = "py-4", ...props }) {
  return (
    <div className={classNames("space-y-4", padding, className)} {...props} />
  );
}

export function CardFooter({ className, align = "end", ...props }) {
  const alignment =
    align === "start"
      ? "justify-start"
      : align === "center"
      ? "justify-center"
      : "justify-end";
  return (
    <div
      className={classNames(
        "mt-6 flex gap-3 border-t border-slate-100 pt-4 dark:border-slate-800",
        alignment,
        className
      )}
      {...props}
    />
  );
}

export function CardBadge({ className, children, tone = "primary", ...props }) {
  const badgeTones = {
    primary: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200",
    neutral: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200",
    success: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200",
    warning: "bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200",
    danger: "bg-rose-50 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200",
  };
  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        badgeTones[tone] ?? badgeTones.primary,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
