import React from "react";
import { classNames } from "./classNames";
import { focusRing, tabVariants } from "./theme";

const TabsContext = React.createContext(null);

const indicatorTones = {
  primary: "bg-indigo-500",
  neutral: "bg-slate-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-rose-500",
};

function useTabsContext(componentName) {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error(`${componentName} debe usarse dentro de <Tabs />`);
  }
  return context;
}

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  idPrefix,
  className,
  variant = "segmented",
  tone = "primary",
  unmountOnExit = false,
  children,
  ...props
}) {
  const baseId = React.useId();
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const activeValue = isControlled ? value : uncontrolledValue;

  const setValue = React.useCallback(
    (nextValue) => {
      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange]
  );

  const context = React.useMemo(
    () => ({
      activeValue,
      setValue,
      orientation,
      idBase: idPrefix ?? baseId,
      variant,
      tone,
      unmountOnExit,
    }),
    [activeValue, setValue, orientation, idPrefix, baseId, variant, tone, unmountOnExit]
  );

  return (
    <TabsContext.Provider value={context}>
      <div
        className={classNames("w-full", className)}
        data-orientation={orientation}
        data-variant={variant}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export const TabList = React.forwardRef(function TabList(
  { className, children, label, ...props },
  ref
) {
  const { orientation, variant } = useTabsContext("TabList");
  const variantConfig = tabVariants[variant] ?? tabVariants.segmented;
  const orientationClasses =
    orientation === "vertical" ? "flex-col" : "flex-row items-center";

  return (
    <div
      ref={ref}
      role="tablist"
      aria-label={label}
      aria-orientation={orientation}
      className={classNames(variantConfig.list, orientationClasses, className)}
      {...props}
    >
      {children}
    </div>
  );
});

export const Tab = React.forwardRef(function Tab(
  { value, children, className, icon: Icon, disabled = false, ...props },
  ref
) {
  const { activeValue, setValue, orientation, idBase, variant, tone } =
    useTabsContext("Tab");
  const isSelected = activeValue === value;

  const tabId = `${idBase}-tab-${value}`;
  const panelId = `${idBase}-panel-${value}`;
  const variantConfig = tabVariants[variant] ?? tabVariants.segmented;

  const handleClick = () => {
    if (!disabled) {
      setValue(value);
    }
  };

  const handleKeyDown = (event) => {
    if (disabled) return;
    const isHorizontal = orientation === "horizontal";
    const isVertical = orientation === "vertical";
    const tabs = event.currentTarget.parentElement?.querySelectorAll('[role="tab"]');
    if (!tabs?.length) return;
    const currentIndex = Array.from(tabs).indexOf(event.currentTarget);
    let nextIndex = currentIndex;

    switch (event.key) {
      case "ArrowRight":
        if (!isHorizontal) break;
        nextIndex = (currentIndex + 1) % tabs.length;
        event.preventDefault();
        tabs[nextIndex]?.focus();
        break;
      case "ArrowLeft":
        if (!isHorizontal) break;
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        event.preventDefault();
        tabs[nextIndex]?.focus();
        break;
      case "ArrowDown":
        if (!isVertical) break;
        nextIndex = (currentIndex + 1) % tabs.length;
        event.preventDefault();
        tabs[nextIndex]?.focus();
        break;
      case "ArrowUp":
        if (!isVertical) break;
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        event.preventDefault();
        tabs[nextIndex]?.focus();
        break;
      case "Home":
        event.preventDefault();
        tabs[0]?.focus();
        break;
      case "End":
        event.preventDefault();
        tabs[tabs.length - 1]?.focus();
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        setValue(value);
        break;
      default:
    }
  };

  return (
    <button
      ref={ref}
      role="tab"
      id={tabId}
      type="button"
      aria-selected={isSelected}
      aria-controls={panelId}
      tabIndex={isSelected ? 0 : -1}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={classNames(
        variantConfig.tabBase,
        focusRing,
        {
          [variantConfig.tabActive]: isSelected,
          [variantConfig.tabInactive]: !isSelected,
          "opacity-50": disabled,
        },
        className
      )}
      {...props}
    >
      {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
      <span>{children}</span>
      {variantConfig.indicator ? (
        <span
          aria-hidden="true"
          className={classNames(
            "pointer-events-none absolute inset-x-0 bottom-0 block h-0.5 origin-center scale-x-0 rounded-full transition-all duration-150 ease-out",
            indicatorTones[tone] ?? indicatorTones.primary,
            isSelected ? "scale-x-100 opacity-100" : "opacity-0"
          )}
        />
      ) : null}
    </button>
  );
});

export function TabPanels({ className, children, ...props }) {
  return (
    <div className={classNames("mt-4 space-y-4", className)} {...props}>
      {children}
    </div>
  );
}

export const TabPanel = React.forwardRef(function TabPanel(
  { value, className, children, forceMount = false, ...props },
  ref
) {
  const { activeValue, idBase, unmountOnExit } = useTabsContext("TabPanel");
  const tabId = `${idBase}-tab-${value}`;
  const panelId = `${idBase}-panel-${value}`;
  const isSelected = activeValue === value;
  const shouldRender = isSelected || forceMount || !unmountOnExit;

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      ref={ref}
      role="tabpanel"
      id={panelId}
      aria-labelledby={tabId}
      hidden={!isSelected}
      tabIndex={0}
      className={classNames(
        "rounded-xl border border-slate-200 bg-white p-6 shadow-sm focus:outline-none dark:border-slate-800 dark:bg-slate-900",
        className
      )}
      {...props}
    >
      {isSelected || forceMount ? children : null}
    </div>
  );
});
