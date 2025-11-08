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
  Spinner,
} from "./components/ui";

const DEFAULT_API_BASE_URL = "http://localhost:3000";
const API_BASE_URL =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL
    : DEFAULT_API_BASE_URL;

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

function HeroSection({ onStartAnalysis }) {
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
        <Button size="lg" tone="success" onClick={onStartAnalysis}>
          Comenzar nuevo análisis
        </Button>
        <Button size="lg" tone="neutral" variant="outline">
          Ver cómo funciona
        </Button>
      </div>
    </section>
  );
}

function AnalysisOutcome({ result, isAnalyzing, error }) {
  if (isAnalyzing) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
      >
        <Spinner size="sm" className="text-indigo-500" />
        <span>Analizando prompt…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="space-y-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-100"
      >
        <p className="font-semibold">No se pudo completar el análisis</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-400"
      >
        Escribe un prompt y presiona «Analizar ahora» para visualizar aquí el desglose generado por la IA.
      </div>
    );
  }

  const { analysis, metadata } = result;
  const evaluatedAt = metadata?.evaluatedAt ? new Date(metadata.evaluatedAt) : null;

  return (
    <section
      aria-labelledby="analysis-outcome-title"
      className="space-y-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-6 dark:border-slate-700 dark:bg-slate-900/60"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 id="analysis-outcome-title" className="text-lg font-semibold text-slate-900 dark:text-white">
            Resultado del análisis
          </h3>
          {evaluatedAt ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluado el {evaluatedAt.toLocaleString()}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col items-end gap-1 text-right">
          <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Puntaje de calidad del prompt
          </span>
          <span className="text-2xl font-semibold text-emerald-600 dark:text-emerald-300">
            {analysis?.promptQualityScore ?? 0}/100
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-950/60 dark:ring-white/10">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Detalles cuantitativos</h4>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Caracteres</dt>
                <dd className="font-medium text-slate-900 dark:text-white">{analysis?.charCount ?? 0}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Palabras</dt>
                <dd className="font-medium text-slate-900 dark:text-white">{analysis?.wordCount ?? 0}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Frases</dt>
                <dd className="font-medium text-slate-900 dark:text-white">{analysis?.structure?.sentenceCount ?? 0}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Longitud media</dt>
                <dd className="font-medium text-slate-900 dark:text-white">{analysis?.structure?.averageSentenceLength ?? 0} palabras</dd>
              </div>
            </dl>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-950/60 dark:ring-white/10">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Palabras clave detectadas</h4>
            {analysis?.keywords?.length ? (
              <ul className="mt-3 grid gap-2 text-sm">
                {analysis.keywords.map(({ word, count }) => (
                  <li key={word} className="flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    <span className="font-medium">{word}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">×{count}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                Añade descriptores específicos para obtener un listado de keywords relevantes.
              </p>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-950/60 dark:ring-white/10">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Estructura del prompt</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>
                {analysis?.structure?.hasQuestions
                  ? "Incluye preguntas para guiar la interpretación del modelo."
                  : "No se detectaron preguntas; considera añadir instrucciones directas si es necesario."}
              </li>
              <li>
                {analysis?.structure?.sentenceCount > 1
                  ? "Buena separación por frases, lo que facilita el desglose de atributos."
                  : "Divide el prompt en varias frases para destacar los elementos clave."}
              </li>
            </ul>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-950/60 dark:ring-white/10">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Sugerencias accionables</h4>
            {analysis?.suggestions?.length ? (
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {analysis.suggestions.map((suggestion, index) => (
                  <li key={`${suggestion}-${index}`} className="flex gap-2">
                    <span aria-hidden="true" className="text-emerald-600 dark:text-emerald-300">
                      ✓
                    </span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                ¡Excelente! No hay sugerencias adicionales para este prompt.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function AnalysisWorkbench({
  prompt,
  onPromptChange,
  charLimit,
  charCount,
  isAnalyzing,
  onAnalyze,
  onReset,
  analysisResult,
  error,
  textareaRef,
}) {
  const canReset = Boolean(prompt || analysisResult || error);
  const isAnalyzeDisabled = isAnalyzing || !prompt.trim();

  return (
    <Card
      id="panel-analisis"
      className="border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
    >
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
            <label
              htmlFor="prompt"
              className="text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              Prompt (máx. {charLimit} caracteres)
            </label>
            <textarea
              id="prompt"
              name="prompt"
              ref={textareaRef}
              rows={6}
              maxLength={charLimit}
              value={prompt}
              onChange={onPromptChange}
              aria-describedby="prompt-helper prompt-count"
              className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left text-sm text-slate-900 shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-600"
              placeholder="Describe la escena, estilo, iluminación y detalles clave de tu imagen ideal..."
            />
            <div className="flex items-start justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span id="prompt-helper">Consejo: mantén frases cortas, usa descriptores concretos.</span>
              <span id="prompt-count" aria-live="polite">
                {charCount} / {charLimit}
              </span>
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
        <AnalysisOutcome result={analysisResult} isAnalyzing={isAnalyzing} error={error} />
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t border-slate-100 pt-6 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Cada análisis permanece disponible durante 1 hora. Autenticarse desbloquea historial y
          evaluaciones en lote.
        </p>
        <ButtonGroup>
          <Button tone="neutral" variant="ghost" onClick={onReset} disabled={!canReset}>
            Reiniciar
          </Button>
          <Button
            tone="success"
            onClick={onAnalyze}
            disabled={isAnalyzeDisabled}
            isLoading={isAnalyzing}
            loadingText="Analizando..."
          >
            Analizar ahora
          </Button>
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

function PromptAnalysisExperience() {
  const [prompt, setPrompt] = React.useState("");
  const [analysisResult, setAnalysisResult] = React.useState(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);
  const { showToast } = useToast();
  const textareaRef = React.useRef(null);
  const charLimit = 2000;

  const focusPrompt = React.useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const handlePromptChange = (event) => {
    const nextValue = event.target.value.slice(0, charLimit);
    setPrompt(nextValue);
  };

  const handleReset = () => {
    setPrompt("");
    setAnalysisResult(null);
    setErrorMessage(null);
    focusPrompt();
  };

  const handleAnalyze = async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      setErrorMessage("Ingresa un prompt antes de analizar.");
      showToast({
        title: "Prompt requerido",
        description: "Escribe un prompt de al menos un carácter para ejecutar el análisis.",
        variant: "warning",
      });
      focusPrompt();
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const baseUrl = (API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, "");
      const response = await fetch(`${baseUrl}/api/analyze/prompt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: trimmedPrompt }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "El servidor devolvió un error inesperado.");
      }

      const data = await response.json();
      setAnalysisResult(data);
      showToast({
        title: "Análisis completado",
        description: "Revisa el puntaje y las sugerencias generadas para tu prompt.",
        variant: "success",
        meta: data?.analysis?.promptQualityScore
          ? [`Puntaje: ${data.analysis.promptQualityScore}/100`]
          : undefined,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error inesperado durante el análisis.";
      setErrorMessage(message);
      showToast({
        title: "Error al analizar",
        description: message,
        variant: "error",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
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
        <HeroSection onStartAnalysis={focusPrompt} />
        <AnalysisWorkbench
          prompt={prompt}
          onPromptChange={handlePromptChange}
          charLimit={charLimit}
          charCount={prompt.length}
          isAnalyzing={isAnalyzing}
          onAnalyze={handleAnalyze}
          onReset={handleReset}
          analysisResult={analysisResult}
          error={errorMessage}
          textareaRef={textareaRef}
        />
        <HowItWorksSection />
        <HighlightsSection />
      </main>
      <footer className="mt-20 flex flex-col items-center gap-2 px-6 text-center text-xs text-slate-500 md:px-12 dark:text-slate-400">
        <span>PromptScore Clone · UI demo inicial</span>
        <span>
          Ejecuta <code>npm run dev:web</code> y abre <code>http://localhost:5173</code> para verla en acción.
        </span>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider position="top-right">
      <div
        className="min-h-screen w-full bg-slate-100 pb-20 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100"
        data-testid="ui-demo-shell"
      >
        <PromptAnalysisExperience />
      </div>
    </ToastProvider>
  );
}
