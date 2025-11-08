export const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:focus-visible:outline-sky-400";

export const surfaceVariants = {
  subtle:
    "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white",
  muted:
    "bg-slate-50 text-slate-900 dark:bg-slate-900/60 dark:text-slate-100",
  overlay:
    "bg-white/80 text-slate-900 backdrop-blur shadow-lg dark:bg-slate-900/80 dark:text-white",
};

export const toneTokens = {
  primary: {
    solid: "bg-indigo-600 text-white hover:bg-indigo-500",
    outline:
      "border border-indigo-200 text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 dark:border-indigo-500/40 dark:text-indigo-200 dark:hover:bg-indigo-500/10",
    ghost: "text-indigo-600 hover:bg-indigo-50 dark:text-indigo-200 dark:hover:bg-indigo-500/10",
    link: "text-indigo-600 hover:text-indigo-500 dark:text-indigo-300",
  },
  neutral: {
    solid: "bg-slate-900 text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white",
    outline:
      "border border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
    ghost: "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
    link: "text-slate-700 hover:text-slate-900 dark:text-slate-100",
  },
  success: {
    solid: "bg-emerald-600 text-white hover:bg-emerald-500",
    outline:
      "border border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500/40 dark:text-emerald-200 dark:hover:bg-emerald-500/10",
    ghost: "text-emerald-600 hover:bg-emerald-50 dark:text-emerald-200 dark:hover:bg-emerald-500/10",
    link: "text-emerald-600 hover:text-emerald-500 dark:text-emerald-300",
  },
  warning: {
    solid: "bg-amber-500 text-slate-900 hover:bg-amber-400",
    outline:
      "border border-amber-200 text-amber-600 hover:bg-amber-50 dark:border-amber-500/40 dark:text-amber-200 dark:hover:bg-amber-500/10",
    ghost: "text-amber-600 hover:bg-amber-50 dark:text-amber-200 dark:hover:bg-amber-500/10",
    link: "text-amber-600 hover:text-amber-500 dark:text-amber-200",
  },
  danger: {
    solid: "bg-rose-600 text-white hover:bg-rose-500",
    outline:
      "border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-500/40 dark:text-rose-200 dark:hover:bg-rose-500/10",
    ghost: "text-rose-600 hover:bg-rose-50 dark:text-rose-200 dark:hover:bg-rose-500/10",
    link: "text-rose-600 hover:text-rose-500 dark:text-rose-200",
  },
};

export const tabVariants = {
  segmented: {
    list:
      "relative flex gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800",
    tabBase:
      "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
    tabActive:
      "bg-white text-indigo-600 shadow-sm dark:bg-slate-900",
    tabInactive:
      "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white",
    indicator: false,
  },
  underline: {
    list:
      "relative flex gap-6 border-b border-slate-200 dark:border-slate-700",
    tabBase:
      "relative pb-2 text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white",
    tabActive:
      "text-indigo-600 dark:text-indigo-300",
    tabInactive: "",
    indicator: true,
  },
};

export function getToneClasses({ tone = "primary", variant = "solid" }) {
  const toneConfig = toneTokens[tone] ?? toneTokens.primary;
  return toneConfig[variant] ?? toneConfig.solid;
}
