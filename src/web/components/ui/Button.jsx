import React from "react";
import { classNames } from "./classNames";

const variantClasses = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600", 
  secondary:
    "bg-white text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:bg-indigo-50 focus-visible:outline-indigo-600",
  ghost:
    "bg-transparent text-indigo-600 hover:bg-indigo-50 focus-visible:outline-indigo-600",
  danger:
    "bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-600",
};

const sizeClasses = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-base",
  xl: "px-6 py-3 text-lg",
};

export const Button = React.forwardRef(
  (
    {
      as: Component = "button",
      variant = "primary",
      size = "md",
      className,
      leadingIcon: LeadingIcon,
      trailingIcon: TrailingIcon,
      isLoading = false,
      loadingText = "",
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <Component
        ref={ref}
        className={classNames(
          "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
          variantClasses[variant] ?? variantClasses.primary,
          sizeClasses[size] ?? sizeClasses.md,
          className
        )}
        disabled={isDisabled}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {LeadingIcon ? (
          <LeadingIcon className="h-4 w-4" aria-hidden="true" />
        ) : null}
        <span className="truncate">
          {isLoading && loadingText ? loadingText : children}
        </span>
        {TrailingIcon ? (
          <TrailingIcon className="h-4 w-4" aria-hidden="true" />
        ) : null}
        {isLoading && !loadingText ? (
          <span className="sr-only">Cargando</span>
        ) : null}
      </Component>
    );
  }
);

Button.displayName = "Button";
