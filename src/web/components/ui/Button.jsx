import React from "react";
import { classNames } from "./classNames";
import { Spinner } from "./Spinner";
import { focusRing, getToneClasses } from "./theme";

const sizeClasses = {
  xs: "h-8 px-2 text-xs",
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

function getButtonClasses({ variant, tone, size, block, className }) {
  return classNames(
    "relative inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
    focusRing,
    sizeClasses[size] ?? sizeClasses.md,
    block ? "w-full" : null,
    getToneClasses({ tone, variant }) ?? getToneClasses({ tone: "primary", variant: "solid" }),
    className
  );
}

function getSpinnerSize(size) {
  if (size === "xs") return "xs";
  if (size === "sm") return "sm";
  if (size === "lg") return "lg";
  return "md";
}

export const Button = React.forwardRef(function Button(
  {
    as: Component = "button",
    variant = "solid",
    tone = "primary",
    size = "md",
    block = false,
    leadingIcon: LeadingIcon,
    trailingIcon: TrailingIcon,
    isLoading = false,
    loadingText,
    spinnerPlacement = "start",
    children,
    className,
    disabled,
    type,
    ...props
  },
  ref
) {
  const computedDisabled = disabled ?? isLoading;
  const showSpinner = isLoading;
  const content = loadingText ?? children;
  const isNativeButton =
    typeof Component === "string" ? Component.toLowerCase() === "button" : false;
  const finalType = isNativeButton ? type ?? "button" : type;
  const accessibilityProps = isNativeButton
    ? { disabled: computedDisabled }
    : {
        "aria-disabled": computedDisabled || undefined,
        tabIndex: computedDisabled ? -1 : undefined,
        role: props.href ? undefined : "button",
      };

  return (
    <Component
      ref={ref}
      className={getButtonClasses({ variant, tone, size, block, className })}
      aria-busy={isLoading || undefined}
      {...accessibilityProps}
      type={finalType}
      {...props}
    >
      {showSpinner && spinnerPlacement === "start" ? (
        <Spinner className="text-current" size={getSpinnerSize(size)} />
      ) : null}
      {!showSpinner && LeadingIcon ? (
        <LeadingIcon className="h-4 w-4" aria-hidden="true" />
      ) : null}
      <span className="truncate">{content}</span>
      {!showSpinner && TrailingIcon ? (
        <TrailingIcon className="h-4 w-4" aria-hidden="true" />
      ) : null}
      {showSpinner && spinnerPlacement === "end" ? (
        <Spinner className="text-current" size={getSpinnerSize(size)} />
      ) : null}
      {isLoading && !loadingText ? (
        <span className="sr-only">Cargando</span>
      ) : null}
    </Component>
  );
});

export const IconButton = React.forwardRef(function IconButton(
  { label, size = "sm", tone = "neutral", variant = "ghost", className, children, ...props },
  ref
) {
  const dimension =
    {
      xs: "!h-8 !w-8",
      sm: "!h-9 !w-9",
      md: "!h-10 !w-10",
      lg: "!h-11 !w-11",
    }[size] ?? "!h-9 !w-9";
  return (
    <Button
      ref={ref}
      aria-label={label}
      size={size}
      tone={tone}
      variant={variant}
      className={classNames(dimension, "p-0", className)}
      {...props}
    >
      <span aria-hidden="true" className="grid h-full w-full place-items-center">
        {children}
      </span>
    </Button>
  );
});

export const ButtonGroup = React.forwardRef(function ButtonGroup(
  { className, children, orientation = "horizontal", attached = true, ...props },
  ref
) {
  const orientationClasses =
    orientation === "vertical"
      ? attached
        ? "flex-col [&>*:not(:first-child)]:-mt-px [&>*]:rounded-none [&>*:first-child]:rounded-t-lg [&>*:last-child]:rounded-b-lg"
        : "flex-col gap-2"
      : attached
      ? "flex-row [&>*:not(:first-child)]:-ml-px [&>*]:rounded-none [&>*:first-child]:rounded-l-lg [&>*:last-child]:rounded-r-lg"
      : "flex-row gap-2";

  return (
    <div
      ref={ref}
      role="group"
      className={classNames("inline-flex", orientationClasses, className)}
      {...props}
    >
      {children}
    </div>
  );
});
