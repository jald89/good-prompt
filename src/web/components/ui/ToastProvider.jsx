import React from "react";
import { classNames } from "./classNames";
import { focusRing, getToneClasses } from "./theme";

const ToastContext = React.createContext(null);

function useStableId() {
  const idRef = React.useRef(0);
  return React.useCallback(() => {
    idRef.current += 1;
    return `toast-${idRef.current}`;
  }, []);
}

const positionClasses = {
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
};

const toastVariants = {
  default:
    "border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-100",
  warning:
    "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-100",
  error:
    "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-100",
  neutral:
    "border-slate-200 bg-slate-50 text-slate-900 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100",
};

export function ToastProvider({
  children,
  duration = 5000,
  maxVisible = 3,
  position = "top-right",
  pauseOnHover = true,
  pauseOnWindowBlur = true,
}) {
  const [toasts, setToasts] = React.useState([]);
  const generateId = useStableId();
  const timers = React.useRef(new Map());
  const toastsRef = React.useRef(toasts);
  toastsRef.current = toasts;

  const clearTimer = React.useCallback((id) => {
    const timeout = timers.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timers.current.delete(id);
    }
  }, []);

  const removeToast = React.useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    clearTimer(id);
  }, [clearTimer]);

  const scheduleDismiss = React.useCallback(
    (id, customDuration) => {
      clearTimer(id);
      const timeout = setTimeout(() => removeToast(id), customDuration);
      timers.current.set(id, timeout);
    },
    [clearTimer, removeToast]
  );

  const showToast = React.useCallback(
    ({
      title,
      description,
      variant = "default",
      action,
      autoDismiss = true,
      id,
      duration: toastDuration,
      meta,
    }) => {
      const toastId = id ?? generateId();
      const resolvedDuration = toastDuration ?? duration;
      clearTimer(toastId);
      setToasts((current) => {
        const filtered = current.filter((toast) => toast.id !== toastId);
        const next = [
          ...filtered,
          {
            id: toastId,
            title,
            description,
            variant,
            action,
            autoDismiss,
            duration: resolvedDuration,
            meta,
          },
        ];
        const limited = next.slice(-maxVisible);
        const limitedIds = new Set(limited.map((toast) => toast.id));
        filtered.forEach((toast) => {
          if (!limitedIds.has(toast.id)) {
            clearTimer(toast.id);
          }
        });
        return limited;
      });

      if (autoDismiss) {
        scheduleDismiss(toastId, resolvedDuration);
      }

      return toastId;
    },
    [clearTimer, duration, generateId, maxVisible, scheduleDismiss]
  );

  const updateToast = React.useCallback((id, patch) => {
    setToasts((current) =>
      current.map((toast) => (toast.id === id ? { ...toast, ...patch } : toast))
    );
  }, []);

  const dismissToast = React.useCallback((id) => {
    removeToast(id);
  }, [removeToast]);

  const dismissAll = React.useCallback(() => {
    toastsRef.current.forEach((toast) => clearTimer(toast.id));
    timers.current.clear();
    setToasts([]);
  }, [clearTimer]);

  const pauseToast = React.useCallback(
    (id) => {
      clearTimer(id);
    },
    [clearTimer]
  );

  const resumeToast = React.useCallback(
    (id) => {
      const toast = toastsRef.current.find((item) => item.id === id);
      if (toast?.autoDismiss) {
        scheduleDismiss(id, toast.duration ?? duration);
      }
    },
    [duration, scheduleDismiss]
  );

  React.useEffect(() => {
    if (!pauseOnWindowBlur) return;
    const handleVisibility = () => {
      const hidden = document.hidden;
      toastsRef.current.forEach((toast) => {
        if (hidden) {
          pauseToast(toast.id);
        } else {
          resumeToast(toast.id);
        }
      });
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [pauseOnWindowBlur, pauseToast, resumeToast]);

  const contextValue = React.useMemo(
    () => ({
      toasts,
      showToast,
      dismissToast,
      updateToast,
      dismissAll,
    }),
    [toasts, showToast, dismissToast, updateToast, dismissAll]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastViewport
        toasts={toasts}
        onDismiss={dismissToast}
        onPause={pauseOnHover ? pauseToast : undefined}
        onResume={pauseOnHover ? resumeToast : undefined}
        position={position}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast debe usarse dentro de <ToastProvider />");
  }
  return context;
}

function ToastViewport({ toasts, onDismiss, onPause, onResume, position }) {
  return (
    <div
      className={classNames(
        "pointer-events-none fixed z-50 flex w-full max-w-sm flex-col gap-3 p-4 sm:w-auto",
        positionClasses[position] ?? positionClasses["top-right"]
      )}
      role="region"
      aria-live="polite"
      aria-label="Notificaciones"
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={onDismiss}
          onPause={onPause}
          onResume={onResume}
        />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss, onPause, onResume }) {
  const { id, title, description, variant, action, meta } = toast;
  const toneClass = toastVariants[variant] ?? toastVariants.default;

  const handlePointerEnter = () => {
    onPause?.(id);
  };

  const handlePointerLeave = () => {
    onResume?.(id);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      onDismiss(id);
    }
  };

  return (
    <div
      role="alert"
      onMouseEnter={handlePointerEnter}
      onMouseLeave={handlePointerLeave}
      onFocus={handlePointerEnter}
      onBlur={handlePointerLeave}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className={classNames(
        "pointer-events-auto overflow-hidden rounded-xl border shadow-lg ring-1 ring-black/5 transition-transform focus-visible:ring-2",
        focusRing,
        toneClass
      )}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            {title ? (
              <p className="text-sm font-semibold">{title}</p>
            ) : null}
            {description ? (
              <p className="mt-1 text-sm leading-5 text-slate-700 dark:text-slate-200">
                {description}
              </p>
            ) : null}
            {Array.isArray(meta) && meta.length ? (
              <ul className="mt-3 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                {meta.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => onDismiss(id)}
            className={classNames(
              "rounded-md p-1 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200",
              focusRing
            )}
            aria-label="Cerrar notificación"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        {action ? <div className="mt-3 flex justify-end">{action}</div> : null}
      </div>
    </div>
  );
}

export function ToastAction({
  as: Component = "button",
  className,
  tone = "neutral",
  children,
  type,
  ...props
}) {
  const isNativeButton = typeof Component === "string" && Component === "button";
  const finalType = isNativeButton ? type ?? "button" : type;
  return (
    <Component
      className={classNames(
        "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium",
        focusRing,
        getToneClasses({ tone, variant: "outline" }),
        className
      )}
      type={finalType}
      {...props}
    >
      {children}
    </Component>
  );
}
