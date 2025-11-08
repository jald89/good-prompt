import React from "react";
import { classNames } from "./classNames";

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
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
};

export function ToastProvider({
  children,
  duration = 4000,
  maxVisible = 3,
  position = "top-right",
}) {
  const [toasts, setToasts] = React.useState([]);
  const generateId = useStableId();
  const timers = React.useRef(new Map());

  const removeToast = React.useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const showToast = React.useCallback(
    ({ title, description, variant = "default", action, autoDismiss = true, id }) => {
      const toastId = id ?? generateId();
      setToasts((current) => {
        const next = [
          ...current,
          {
            id: toastId,
            title,
            description,
            variant,
            action,
          },
        ];
        return next.slice(-maxVisible);
      });

      if (autoDismiss) {
        const timeout = setTimeout(() => removeToast(toastId), duration);
        timers.current.set(toastId, timeout);
      }

      return toastId;
    },
    [duration, generateId, maxVisible, removeToast]
  );

  const contextValue = React.useMemo(
    () => ({
      toasts,
      showToast,
      dismissToast: removeToast,
    }),
    [toasts, showToast, removeToast]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={removeToast} position={position} />
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

function ToastViewport({ toasts, onDismiss, position }) {
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
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  const { id, title, description, variant, action } = toast;

  return (
    <div
      role="alert"
      className={classNames(
        "pointer-events-auto overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg ring-1 ring-black/5 transition-transform focus-within:ring-2 focus-within:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900",
        {
          "border-green-500": variant === "success",
          "border-yellow-500": variant === "warning",
          "border-red-500": variant === "error",
        }
      )}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            {title ? (
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {title}
              </p>
            ) : null}
            {description ? (
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => onDismiss(id)}
            className="rounded-md p-1 text-slate-400 transition hover:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            aria-label="Cerrar notificación"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        {action ? (
          <div className="mt-3 flex justify-end">{action}</div>
        ) : null}
      </div>
    </div>
  );
}
