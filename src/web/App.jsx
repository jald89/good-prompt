import React from "react";
import {
  Button,
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
// Frontend always posts to the server endpoint. Server will decide whether to forward to n8n.

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

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return null;
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  const formatted = index === 0 ? Math.round(value).toString() : value.toFixed(1);
  return `${formatted} ${units[index]}`;
}

function UploadDropzone({ image, onSelectImage, onRemoveImage, isDisabled }) {
  const fileInputRef = React.useRef(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const instructionsId = React.useId();

  const handleFiles = React.useCallback(
    (fileList) => {
      if (!fileList?.length || isDisabled) return;
      const [file] = Array.from(fileList);
      if (file) {
        onSelectImage?.(file);
      }
    },
    [isDisabled, onSelectImage]
  );

  const handleInputChange = (event) => {
    const { files } = event.target;
    handleFiles(files);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer?.files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    if (isDisabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const openFileDialog = () => {
    if (isDisabled) return;
    fileInputRef.current?.click();
  };

  const handleKeyDown = (event) => {
    if (isDisabled) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openFileDialog();
    }
  };

  const imageName = image?.file?.name ?? image?.name ?? null;
  const imageSize = image?.file?.size ?? image?.size ?? null;

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        aria-describedby={instructionsId}
        className={`group flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 text-center text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-950 ${
          isDragging
            ? "border-indigo-400 bg-indigo-50 dark:border-indigo-500 dark:bg-slate-900/70"
            : "border-slate-300 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-600 dark:bg-slate-900 dark:hover:border-indigo-500"
        } ${isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        onClick={openFileDialog}
        onKeyDown={handleKeyDown}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <span className="text-base font-semibold text-slate-700 dark:text-slate-200">
          Arrastra y suelta o haz clic para subir
        </span>
        <span id={instructionsId} className="text-xs text-slate-500 dark:text-slate-400">
          PNG o JPG, hasta 10MB. Eliminamos los archivos tras 1 hora.
        </span>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
          ✓ Drag & drop habilitado
        </span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg"
          className="sr-only"
          onChange={handleInputChange}
          disabled={isDisabled}
        />
      </div>
      {imageName ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <div className="flex flex-col text-left">
            <span className="font-medium">{imageName}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {imageSize ? formatFileSize(imageSize) : "Tamaño desconocido"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {image?.previewUrl ? (
              <img
                src={image.previewUrl}
                alt="Vista previa de la imagen cargada"
                className="h-12 w-12 rounded-md object-cover ring-1 ring-slate-900/10 dark:ring-white/10"
              />
            ) : null}
            <Button
              tone="neutral"
              variant="ghost"
              size="sm"
              type="button"
              onClick={onRemoveImage}
            >
              Quitar
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

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
    // Detectar si el error es un objeto con la estructura esperada
    const errorObject = typeof error === 'object' && error !== null ? error : null;
    const errorMessage = errorObject?.error?.message || error;
    const errorCode = errorObject?.error?.code;
    const requestId = errorObject?.error?.requestId;
    const mode = errorObject?.error?.mode;

    return (
      <div
        role="alert"
        aria-live="assertive"
        className="space-y-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-100"
      >
        <p className="font-semibold">No se pudo completar el análisis</p>
        <p>{errorMessage}</p>
        {(errorCode || requestId || mode) && (
          <div className="mt-2 space-y-1 border-t border-rose-200/50 pt-2 text-xs dark:border-rose-500/30">
            {errorCode && (
              <p>
                <span className="font-medium">Código:</span> {errorCode}
              </p>
            )}
            {requestId && (
              <p>
                <span className="font-medium">ID de solicitud:</span> {requestId}
              </p>
            )}
            {mode && (
              <p>
                <span className="font-medium">Modo:</span> {mode}
              </p>
            )}
          </div>
        )}
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
  const analysisModeLabel =
    metadata?.analysisMode === "image"
      ? "Prompt + imagen"
      : metadata?.analysisMode === "prompt"
      ? "Sólo prompt"
      : null;

  return (
    <section
      aria-labelledby="analysis-outcome-title"
      className="space-y-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-6 dark:border-slate-700 dark:bg-slate-900/60"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 id="analysis-outcome-title" className="text-lg font-semibold text-slate-900 dark:text-white">
              Resultado del análisis
            </h3>
            {analysisModeLabel ? (
              <span className="inline-flex items-center rounded-full bg-slate-900/5 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-100/10 dark:text-slate-300">
                {analysisModeLabel}
              </span>
            ) : null}
          </div>
          {evaluatedAt ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluado el {evaluatedAt.toLocaleString()}
            </p>
          ) : null}
          {metadata?.imageName ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Imagen analizada: <span className="font-medium text-slate-700 dark:text-slate-200">{metadata.imageName}</span>
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
            {Array.isArray(analysis?.keywords) && analysis.keywords.length ? (
              <ul className="mt-3 grid gap-2 text-sm">
                {analysis.keywords.map((kw, idx) => {
                  if (typeof kw === "string") {
                    return (
                      <li key={kw} className="flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        <span className="font-medium">{kw}</span>
                      </li>
                    );
                  } else if (kw && typeof kw === "object" && "word" in kw) {
                    return (
                      <li key={kw.word} className="flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        <span className="font-medium">{kw.word}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{kw.count ? `×${kw.count}` : null}</span>
                      </li>
                    );
                  }
                  return null;
                })}
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

const modeLabels = {
  prompt: "Sólo prompt",
  image: "Prompt + imagen",
  history: "Historial",
};

function AnalysisWorkbench({
  mode,
  onModeChange,
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
  uploadedImage,
  onSelectImage,
  onRemoveImage,
  history,
  onHistorySelect,
}) {
  const canReset = Boolean(prompt || analysisResult || error || uploadedImage);
  const trimmedPrompt = prompt.trim();
  const isAnalyzeDisabled =
    mode === "history" || isAnalyzing || !trimmedPrompt || (mode === "image" && !uploadedImage);
  const showActions = mode === "prompt" || mode === "image";

  const handleSubmit = (event) => {
    event.preventDefault();
    onAnalyze();
  };

  return (
    <Card
      id="panel-analisis"
      className="border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
    >
      <CardHeader className="gap-1">
        <CardTitle className="text-left text-2xl">Panel de análisis</CardTitle>
        <CardDescription className="text-left">
          Selecciona el tipo de evaluación y sigue los pasos guiados para obtener resultados claros.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={mode} onValueChange={onModeChange} variant="segmented">
          <TabList label="Selecciona el flujo de evaluación">
            <Tab value="prompt">Sólo prompt</Tab>
            <Tab value="image">Prompt + imagen</Tab>
            <Tab value="history">Historial</Tab>
          </TabList>
          <TabPanels className="mt-4 grid gap-3 md:grid-cols-3">
            <TabPanel
              value="prompt"
              className="border-none bg-transparent p-0 text-left text-sm text-slate-600 shadow-none whitespace-nowrap dark:text-slate-300"
            >
              Ideal para refinar ideas antes de producir imágenes nuevas.
            </TabPanel>
            <TabPanel
              value="image"
              className="border-none bg-transparent p-0 text-left text-sm text-slate-600 shadow-none dark:text-slate-300"
            >
              Compara tu prompt con una imagen generada y recibe un match score accionable.
            </TabPanel>
            <TabPanel
              value="history"
              className="border-none bg-transparent p-0 text-left text-sm text-slate-600 shadow-none dark:text-slate-300"
            >
              Consulta análisis anteriores guardados en tu sesión actual.
            </TabPanel>
          </TabPanels>
        </Tabs>

        {mode === "prompt" ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
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
                <span id="prompt-helper">
                  Consejo: mantén frases cortas, usa descriptores concretos.
                </span>
                <span id="prompt-count" aria-live="polite">
                  {charCount} / {charLimit}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button tone="neutral" variant="ghost" type="button" onClick={onReset} disabled={!canReset}>
                Reiniciar
              </Button>
              <Button
                tone="success"
                type="submit"
                disabled={isAnalyzeDisabled}
                isLoading={isAnalyzing}
                loadingText="Analizando..."
              >
                Analizar ahora
              </Button>
            </div>
          </form>
        ) : null}

        {mode === "image" ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
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
                aria-describedby="prompt-helper-image prompt-count-image"
                className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left text-sm text-slate-900 shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-600"
                placeholder="Describe la escena que quieres comparar con tu imagen generada..."
              />
              <div className="flex items-start justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span id="prompt-helper-image">
                  Describe elementos visibles para mejorar el match score.
                </span>
                <span id="prompt-count-image" aria-live="polite">
                  {charCount} / {charLimit}
                </span>
              </div>
            </div>
            <UploadDropzone
              image={uploadedImage}
              onSelectImage={onSelectImage}
              onRemoveImage={onRemoveImage}
              isDisabled={isAnalyzing}
            />
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button tone="neutral" variant="ghost" type="button" onClick={onReset} disabled={!canReset}>
                Reiniciar
              </Button>
              <Button
                tone="success"
                type="submit"
                disabled={isAnalyzeDisabled}
                isLoading={isAnalyzing}
                loadingText="Analizando..."
              >
                Analizar ahora
              </Button>
            </div>
          </form>
        ) : null}

        {mode === "history" ? (
          <div className="space-y-3" role="region" aria-live="polite">
            {history?.length ? (
              <ul className="space-y-2" aria-label="Historial de análisis">
                {history.map((entry) => (
                  <li key={entry.id}>
                    <button
                      type="button"
                      onClick={() => onHistorySelect(entry)}
                      className="flex w-full flex-col gap-1 rounded-xl border border-slate-200 bg-white p-4 text-left text-sm shadow-sm transition hover:border-indigo-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-400 dark:focus-visible:ring-indigo-500"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          {modeLabels[entry.mode] ?? "Análisis"}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {entry.createdAt ? new Date(entry.createdAt).toLocaleString() : "Fecha desconocida"}
                        </span>
                      </div>
                      <p className="font-medium text-slate-800 dark:text-slate-100">
                        {entry.prompt}
                      </p>
                      {entry.metadata?.imageName ? (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Imagen: {entry.metadata.imageName}
                        </p>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
                Aún no tienes análisis guardados en esta sesión. Ejecuta un análisis para verlo aquí.
              </p>
            )}
          </div>
        ) : null}

        <AnalysisOutcome result={analysisResult} isAnalyzing={isAnalyzing} error={error} />
      </CardContent>
      <CardFooter className="flex flex-col gap-2 border-t border-slate-100 pt-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <p>
          Cada análisis permanece disponible durante 1 hora. Autenticarse desbloquea historial persistente y evaluaciones en lote.
        </p>
        {showActions ? (
          <p>
            Consejo: guarda tu resultado en una pestaña aparte o descárgalo antes de que expire.
          </p>
        ) : null}
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
  const [mode, setMode] = React.useState("prompt");
  const [uploadedImage, setUploadedImage] = React.useState(null);
  const [history, setHistory] = React.useState([]);
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

  const focusPromptSmooth = React.useCallback(() => {
    if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
      window.requestAnimationFrame(() => {
        focusPrompt();
      });
    } else {
      focusPrompt();
    }
  }, [focusPrompt]);

  const handleModeChange = React.useCallback(
    (nextMode) => {
      setMode(nextMode);
      setErrorMessage(null);
      if (nextMode === "prompt" || nextMode === "image") {
        focusPromptSmooth();
      }
    },
    [focusPromptSmooth]
  );

  const handlePromptChange = (event) => {
    const nextValue = event.target.value.slice(0, charLimit);
    setPrompt(nextValue);
  };

  const handleImageSelect = React.useCallback(
    (file) => {
      if (!file) return;
      const isValidType = /image\/(png|jpe?g)$/i.test(file.type || "");
      if (!isValidType) {
        showToast({
          title: "Formato no soportado",
          description: "Sube una imagen PNG o JPG para continuar.",
          variant: "warning",
        });
        return;
      }

      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        showToast({
          title: "Archivo demasiado grande",
          description: "La imagen debe pesar menos de 10MB.",
          variant: "warning",
        });
        return;
      }

      setUploadedImage((previous) => {
        if (previous?.previewUrl) {
          URL.revokeObjectURL(previous.previewUrl);
        }
        return {
          file,
          previewUrl: URL.createObjectURL(file),
        };
      });

      showToast({
        title: "Imagen lista",
        description: `${file.name} se añadió al análisis.`,
        variant: "success",
      });
    },
    [showToast]
  );

  const handleImageRemove = React.useCallback(
    (options = {}) => {
      setUploadedImage((previous) => {
        if (previous?.previewUrl) {
          URL.revokeObjectURL(previous.previewUrl);
        }
        return null;
      });
      if (!options?.silent) {
        showToast({
          title: "Imagen removida",
          description: "Puedes cargar una nueva imagen cuando quieras.",
          variant: "neutral",
        });
      }
    },
    [showToast]
  );

  React.useEffect(() => {
    return () => {
      if (uploadedImage?.previewUrl) {
        URL.revokeObjectURL(uploadedImage.previewUrl);
      }
    };
  }, [uploadedImage]);

  const handleReset = () => {
    setPrompt("");
    setAnalysisResult(null);
    setErrorMessage(null);
    if (uploadedImage) {
      handleImageRemove({ silent: true });
    }
    if (mode === "prompt" || mode === "image") {
      focusPromptSmooth();
    }
  };

  const decorateResult = (data, currentMode) => {
    const evaluatedAt = data?.metadata?.evaluatedAt ?? new Date().toISOString();
    const isImageMode = currentMode === "image";
    const imageName = isImageMode && uploadedImage?.file?.name ? uploadedImage.file.name : undefined;
    const imageSize = isImageMode && uploadedImage?.file?.size ? uploadedImage.file.size : undefined;

    return {
      ...data,
      metadata: {
        ...data?.metadata,
        evaluatedAt,
        analysisMode: currentMode,
        imageName,
        imageSize,
      },
    };
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
      focusPromptSmooth();
      return;
    }

    if (mode === "image" && !uploadedImage) {
      setErrorMessage("Añade una imagen para ejecutar la comparación.");
      showToast({
        title: "Imagen requerida",
        description: "Sube una imagen PNG o JPG para evaluar junto al prompt.",
        variant: "warning",
      });
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const baseUrl = (API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, "");

      let response;
      // If we're in image mode and have a File, send multipart/form-data
      if (mode === "image" && uploadedImage?.file) {
        const form = new FormData();
        form.append("prompt", trimmedPrompt);
        form.append("mode", mode);
        // attach the actual File object under the field name 'image'
        form.append("image", uploadedImage.file, uploadedImage.file.name);

        response = await fetch(`${baseUrl}/api/analyze/prompt`, {
          method: "POST",
          body: form,
        });
      } else {
        const payload = {
          prompt: trimmedPrompt,
          mode,
        };

        response = await fetch(`${baseUrl}/api/analyze/prompt`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      // Read raw text first (safer for error handling), then try to parse JSON
      const raw = await response.text();
      let data;
      try {
        data = raw ? JSON.parse(raw) : undefined;
      } catch (err) {
        data = undefined;
      }

      // If server signaled an error (status code or error payload), set structured error and stop
      if (!response.ok || (data && data.error)) {
        const errorPayload = data?.error
          ? { error: data.error }
          : { error: { message: raw || "El servidor devolvió un error desconocido." } };

        setErrorMessage(errorPayload);
        showToast({
          title: "Error al analizar",
          description: errorPayload.error.message,
          variant: "error",
          meta: errorPayload.error.requestId ? [`ID: ${errorPayload.error.requestId}`] : undefined,
        });
        return;
      }

      const enrichedResult = decorateResult(data, mode);
      setAnalysisResult(enrichedResult);
      setHistory((previous) => {
        const entry = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          prompt: trimmedPrompt,
          mode,
          createdAt: enrichedResult.metadata?.evaluatedAt,
          metadata: enrichedResult.metadata,
          result: enrichedResult,
        };
        const next = [entry, ...previous];
        return next.slice(0, 15);
      });
      showToast({
        title: "Análisis completado",
        description: "Revisa el puntaje y las sugerencias generadas para tu prompt.",
        variant: "success",
        meta: enrichedResult?.analysis?.promptQualityScore
          ? [`Puntaje: ${enrichedResult.analysis.promptQualityScore}/100`]
          : undefined,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error inesperado durante el análisis.";
      const errorCode = error?.cause?.code;
      const requestId = error?.cause?.requestId;
      
      setErrorMessage(message);
      
      showToast({
        title: "Error al analizar",
        description: message,
        variant: "error",
        meta: requestId ? [`ID: ${requestId}`] : undefined,
        action: errorCode === "RATE_LIMIT_EXCEEDED" ? (
          <ToastAction onClick={() => console.log("Notificar cuando el rate limit termine")}>
            Notificarme
          </ToastAction>
        ) : undefined
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleHistorySelect = React.useCallback(
    (entry) => {
      if (!entry) return;
      setAnalysisResult(entry.result);
      setPrompt(entry.prompt);
      setMode(entry.mode === "image" ? "image" : "prompt");
      setErrorMessage(null);
      if (entry.metadata?.imageName) {
        setUploadedImage({ name: entry.metadata.imageName, size: entry.metadata?.imageSize });
      } else {
        setUploadedImage(null);
      }
      focusPromptSmooth();
      showToast({
        title: "Resultado cargado",
        description: "Mostrando el análisis seleccionado del historial.",
        variant: "neutral",
      });
    },
    [focusPromptSmooth, showToast]
  );

  const handleStartAnalysis = React.useCallback(() => {
    setMode("prompt");
    focusPromptSmooth();
  }, [focusPromptSmooth]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pt-12 md:px-12">
      <header className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            ¿Qué tan bueno es tu prompt?
          </p>
          <p className="text-base text-slate-600 dark:text-slate-300">
            Analiza tu prompt y veamos que puede mejorar.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <ThemeToggle />
        </div>
      </header>
      <main className="flex flex-col gap-16">
        <HeroSection onStartAnalysis={handleStartAnalysis} />
        <AnalysisWorkbench
          mode={mode}
          onModeChange={handleModeChange}
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
          uploadedImage={uploadedImage}
          onSelectImage={handleImageSelect}
          onRemoveImage={handleImageRemove}
          history={history}
          onHistorySelect={handleHistorySelect}
        />
        <HowItWorksSection />
        <HighlightsSection />
      </main>
      <footer className="mt-20 flex flex-col items-center gap-2 px-6 text-center text-xs text-slate-500 md:px-12 dark:text-slate-400">
        <span>Good Prompt · V1</span>
        <span>
          A product developed by{' '}
          <a
            href="https://djibia.cloud"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-slate-700 dark:hover:text-slate-200"
          >
            Djibia AI Agency
          </a>
          .
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
