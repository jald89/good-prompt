import React from "react";
import { classNames } from "./classNames";

const TabsContext = React.createContext(null);

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
    }),
    [activeValue, setValue, orientation, idPrefix, baseId]
  );

  return (
    <TabsContext.Provider value={context}>
      <div
        className={classNames("w-full", className)}
        data-orientation={orientation}
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
  const { orientation } = useTabsContext("TabList");

  return (
    <div
      ref={ref}
      role="tablist"
      aria-label={label}
      aria-orientation={orientation}
      className={classNames(
        "relative flex gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800",
        className
      )}
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
  const { activeValue, setValue, orientation, idBase } = useTabsContext("Tab");
  const isSelected = activeValue === value;

  const tabId = `${idBase}-tab-${value}`;
  const panelId = `${idBase}-panel-${value}`;

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
        "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-50",
        {
          "bg-white text-indigo-600 shadow-sm dark:bg-slate-900": isSelected,
          "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white": !isSelected,
        },
        className
      )}
      {...props}
    >
      {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
      <span>{children}</span>
    </button>
  );
});

export function TabPanels({ className, children, ...props }) {
  return (
    <div className={classNames("mt-4", className)} {...props}>
      {children}
    </div>
  );
}

export const TabPanel = React.forwardRef(function TabPanel(
  { value, className, children, ...props },
  ref
) {
  const { activeValue, idBase } = useTabsContext("TabPanel");
  const tabId = `${idBase}-tab-${value}`;
  const panelId = `${idBase}-panel-${value}`;
  const isSelected = activeValue === value;

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
      {isSelected ? children : null}
    </div>
  );
});
