import React from "react";
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  ToastProvider,
  ToastAction,
  useToast,
} from "./components/ui";

function useThemePreference() {
  const [theme, setTheme] = React.useState(() => {
    if (typeof window === "undefined") {
      return "light";
    }
    const stored = window.localStorage.getItem("promptscore-theme");
    if (stored === "light" || stored === "dark") {
      return stored;
    }
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  });

  React.useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined") return;
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    window.localStorage.setItem("promptscore-theme", theme);
  }, [theme]);

  return [theme, setTheme];
}

function ThemeToggle() {
  const [theme, setTheme] = useThemePreference();
  const isDark = theme === "dark";

  return (
    <Button
      variant="outline"
      tone="neutral"
      size="sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-pressed={isDark}
    >
      {isDark ? "Modo claro" : "Modo oscuro"}
    </Button>
  );
}

function DemoToastButton() {
  const { showToast } = useToast();

  return (
    <Button
      tone="success"
      onClick={() =>
        showToast({
          title: "Análisis completado",
          description:
            "Este es un ejemplo de notificación accesible desde el kit de componentes.",
          variant: "success",
          action: (
            <ToastAction onClick={() => console.log("guardar-resultado")}>Guardar</ToastAction>
          ),
        })
      }
    >
      Probar notificación
    </Button>
  );
}

function AnalysisTabs() {
  return (
    <Tabs defaultValue="prompt" variant="segmented">
      <TabList label="Selecciona el flujo de evaluación">
        <Tab value="prompt">Sólo prompt</Tab>
        <Tab value="imagen">Prompt + imagen</Tab>
        <Tab value="historial">Historial</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="prompt" className="space-y-2 text-sm text-slate-600 dark:text-slate-200">
          <p>
            Ingresa hasta 2,000 caracteres y obtén claridad sobre estilo, atributos y oportunidades
            de mejora.
          </p>
          <p className="font-medium text-slate-900 dark:text-white">
            Perfecto para pulir ideas antes de generar nuevas imágenes.
          </p>
        </TabPanel>
        <TabPanel value="imagen" className="space-y-2 text-sm text-slate-600 dark:text-slate-200">
          <p>
            Sube una imagen y compara contra tu prompt para recibir un match score y recomendaciones
            guiadas.
          </p>
        </TabPanel>
        <TabPanel value="historial" className="space-y-2 text-sm text-slate-600 dark:text-slate-200">
          <p>
            Guarda resultados al iniciar sesión vía OAuth para revisarlos más tarde o repetirlos en
            lote.
          </p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

const steps = [
  {
    title: "Describe tu idea",
    detail:
      "Escribe el prompt en nuestro editor guiado. Las sugerencias en vivo aseguran un inicio claro y concreto.",
  },
  {
    title: "Añade contexto visual",
    detail:
      "Arrastra y suelta tu imagen IA (PNG/JPG) o continúa sólo con el texto para un análisis inmediato.",
  },
  {
    title: "Recibe recomendaciones",
    detail:
      "Obtén un match score transparente, un desglose de atributos y consejos accionables para tu siguiente iteración.",
  },
];

const highlights = [
  "✓ Match Score comprensible con explicaciones claras.",
  "✓ Atributos detectados vs. atributos descritos al instante.",
  "✓ Consejos personalizados impulsados por IA responsable.",
  "✓ Accesibilidad WCAG AA y navegación por teclado.",
  "✓ Multilenguaje español/inglés en toda la experiencia.",
  "✓ Transparencia de costes y opción para apoyar la misión.",
];

function HeroSection() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 text-center">
      <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-slate-200/80 px-4 py-1 text-sm font-medium text-slate-700 dark:bg-slate-700/60 dark:text-slate-200">
        Plataforma PromptScore · Beta comunitaria
      </div>
      <div className="space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl dark:text-white">
          Analyze Your Prompt con una experiencia moderna y accesible
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-slate-600 dark:text-slate-200">
          Evalúa prompts y resultados generados por IA con una interfaz minimalista, controles claros
          y recomendaciones prácticas para mejorar tu flujo creativo.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button size="lg" tone="success">
          Comenzar nuevo análisis
        </Button>
        <Button size="lg" tone="neutral" variant="outline">
          Ver cómo funciona
        </Button>
      </div>
    </section>
  );
}

function AnalysisWorkbench() {
  return (
    <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <CardHeader className="gap-1">
        <CardTitle className="text-left text-2xl">Panel de análisis</CardTitle>
        <CardDescription className="text-left">
          Centro de control enfocado: ingresa el prompt, adjunta tu imagen y obtén insights sin
          distracciones.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-3">
            <label htmlFor="prompt" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Prompt (máx. 2000 caracteres)
            </label>
            <textarea
              id="prompt"
              name="prompt"
              rows={6}
              className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left text-sm text-slate-900 shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-600"
              placeholder="Describe la escena, estilo, iluminación y detalles clave de tu imagen ideal..."
            />
            <div className="flex items-start justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span>Consejo: mantén frases cortas, usa descriptores concretos.</span>
              <span>0 / 2000</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Imagen (opcional)
            </span>
            <button
              type="button"
              className="group flex h-full min-h-[220px] flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center text-sm text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:bg-slate-900/70"
            >
              <span className="text-base font-semibold text-slate-700 dark:text-slate-200">
                Arrastra y suelta o haz clic para subir
              </span>
              <span>PNG o JPG, hasta 10MB</span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
                ✓ Drag & drop habilitado
              </span>
            </button>
            <AnalysisTabs />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t border-slate-100 pt-6 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Cada análisis permanece disponible durante 1 hora. Autenticarse desbloquea historial y
          evaluaciones en lote.
        </p>
        <ButtonGroup>
          <Button tone="neutral" variant="ghost">
            Reiniciar
          </Button>
          <Button tone="success">Analizar ahora</Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}

function HowItWorksSection() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.2fr,1fr]">
      <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>
            Un proceso guiado, sin fricción, pensado para iterar prompts y analizar resultados en
            segundos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-6">
            {steps.map((step, index) => (
              <li key={step.title} className="flex gap-4 text-left">
                <span className="mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-base font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-200">
                  {index + 1}
                </span>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-900 dark:text-white">{step.title}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
      <Card className="flex flex-col justify-between gap-6 border border-emerald-200 bg-emerald-50/70 p-6 text-left dark:border-emerald-500/40 dark:bg-emerald-950/40">
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-200">
            Support Our Mission
          </h3>
          <p className="text-sm text-emerald-900/80 dark:text-emerald-200/80">
            Tu aporte mantiene el análisis disponible para la comunidad. Transparencia total en los
            costes de modelos y almacenamiento.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button tone="success" size="lg">
            Donar ahora
          </Button>
          <DemoToastButton />
        </div>
      </Card>
    </section>
  );
}

function HighlightsSection() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">What You Get</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Beneficios clave diseñados para ofrecer claridad, confianza y una experiencia inclusiva.
      </p>
      <ul className="mt-6 grid gap-3 text-left sm:grid-cols-2">
        {highlights.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
            <span aria-hidden="true" className="mt-1 text-emerald-600 dark:text-emerald-300">
              ✓
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function App() {
  return (
    <ToastProvider position="top-right">
      <div
        className="min-h-screen w-full bg-slate-100 pb-20 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100"
        data-testid="ui-demo-shell"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pt-12 md:px-12">
          <header className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                PromptScore Clone
              </p>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Evaluación avanzada de prompts e imágenes impulsada por IA de visión.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <ThemeToggle />
              <Button tone="success" variant="outline">
                Ver transparencia de costes
              </Button>
            </div>
          </header>
          <main className="flex flex-col gap-16">
            <HeroSection />
            <AnalysisWorkbench />
            <HowItWorksSection />
            <HighlightsSection />
          </main>
        </div>
        <footer className="mt-20 flex flex-col items-center gap-2 px-6 text-center text-xs text-slate-500 md:px-12 dark:text-slate-400">
          <span>PromptScore Clone · UI demo inicial</span>
          <span>
            Ejecuta <code>npm run dev:web</code> y abre <code>http://localhost:5173</code> para verla en acción.
          </span>
        </footer>
      </div>
    </ToastProvider>
  );
}
