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

function DemoToastButton() {
  const { showToast } = useToast();

  return (
    <Button
      onClick={() =>
        showToast({
          title: "Análisis completado",
          description:
            "Este es un ejemplo de toast generado desde el kit de componentes.",
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

function DemoTabs() {
  return (
    <Tabs defaultValue="prompt" variant="segmented">
      <TabList label="Modos de análisis">
        <Tab value="prompt">Prompt</Tab>
        <Tab value="imagen">Prompt + imagen</Tab>
        <Tab value="historial">Historial</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="prompt" className="space-y-2 text-sm text-slate-600 dark:text-slate-200">
          <p>
            Envía únicamente texto para obtener sugerencias de claridad, estilo y cobertura de
            atributos.
          </p>
          <p className="font-medium text-slate-900 dark:text-white">
            Ideal para iterar rápido antes de generar imágenes.
          </p>
        </TabPanel>
        <TabPanel value="imagen" className="space-y-2 text-sm text-slate-600 dark:text-slate-200">
          <p>
            Combina prompt e imagen para calcular el match score, detectar atributos presentes y
            recibir consejos de mejora.
          </p>
        </TabPanel>
        <TabPanel value="historial" className="space-y-2 text-sm text-slate-600 dark:text-slate-200">
          <p>
            Disponible para cuentas autenticadas. Revisa comparativas y vuelve a ejecutar
            análisis anteriores.
          </p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

function DemoHero() {
  return (
    <header className="mx-auto flex max-w-5xl flex-col gap-6 px-6 pt-16 text-center md:px-12">
      <p className="mx-auto inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200">
        UI demo · Tailwind + Vite
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl dark:text-white">
        Experimenta el kit de componentes base
      </h1>
      <p className="text-lg text-slate-600 dark:text-slate-200">
        Arranca el frontend con Vite y reutiliza botones, tarjetas, pestañas y toasts en cualquier
        pantalla del proyecto PromptScore.
      </p>
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button size="lg">Abrir documentación</Button>
        <Button size="lg" tone="neutral" variant="outline">
          Diseñar nueva pantalla
        </Button>
      </div>
    </header>
  );
}

function DemoCard() {
  return (
    <Card className="mx-auto w-full max-w-3xl border border-slate-200/60 bg-white/80 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/80">
      <CardHeader>
        <CardTitle>Panel interactivo</CardTitle>
        <CardDescription>
          Usa las pestañas para alternar entre los flujos principales y lanza una notificación de
          prueba.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <DemoTabs />
      </CardContent>
      <CardFooter className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Todo el estado está aislado dentro de cada componente, listo para integrarse con la API.
        </p>
        <ButtonGroup>
          <Button tone="neutral" variant="ghost">
            Reiniciar
          </Button>
          <DemoToastButton />
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}

export default function App() {
  return (
    <ToastProvider position="top-right">
      <div
        className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-white to-indigo-50 pb-20 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 dark:text-slate-100"
        data-testid="ui-demo-shell"
      >
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 md:px-12">
          <DemoHero />
          <DemoCard />
        </main>
        <footer className="mt-16 flex flex-col items-center gap-2 px-6 text-center text-xs text-slate-500 md:px-12 dark:text-slate-400">
          <span>PromptScore Clone · UI demo inicial</span>
          <span>
            Ejecuta <code>npm run dev:web</code> y abre <code>http://localhost:5173</code> para verla
            en acción.
          </span>
        </footer>
      </div>
    </ToastProvider>
  );
}
