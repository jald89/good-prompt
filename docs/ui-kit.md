# Kit de componentes base

El kit de UI vive en `src/web/components/ui` y está pensado para reutilizarse en todas las pantallas del clon de PromptScore. Los componentes siguen convenciones de accesibilidad (roles, estados de foco, mensajes auxiliares) y están listos para personalizarse con TailwindCSS.

## Botones (`Button`, `IconButton`, `ButtonGroup`)
- **Variantes**: `solid`, `outline`, `ghost`, `link`.
- **Tonos**: `primary`, `neutral`, `success`, `warning`, `danger`.
- **Tamaños**: `xs`, `sm`, `md`, `lg`.
- Incluyen soporte para estado de carga (`isLoading`), íconos al inicio/fin y spinners accesibles.
- `IconButton` agrega dimensiones cuadradas y `ButtonGroup` permite agrupar botones horizontal o verticalmente, con opción `attached` para un look compacto.

```jsx
import { Button, ButtonGroup, IconButton } from "@/web/components/ui";

<Button tone="primary">Analizar prompt</Button>
<Button tone="success" variant="outline">Guardar</Button>
<Button isLoading loadingText="Procesando…" />
<ButtonGroup>
  <Button>Anterior</Button>
  <Button>Próximo</Button>
</ButtonGroup>
```

## Tarjetas (`Card`)
- Variantes `outlined`, `elevated`, `muted` y prop `tone` para acentos.
- `interactive` agrega sombras y `focusRing` cuando se usa como CTA.
- Subcomponentes: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `CardBadge`.

```jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/web/components/ui";

<Card variant="elevated" interactive>
  <CardHeader>
    <CardTitle>Match Score</CardTitle>
    <CardDescription>Resultados recientes del análisis</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Contenido */}
  </CardContent>
  <CardFooter>
    <Button tone="primary">Ver detalles</Button>
  </CardFooter>
</Card>
```

## Tabs (`Tabs`, `TabList`, `Tab`, `TabPanels`, `TabPanel`)
- Variantes visuales: `segmented` (por defecto) y `underline`.
- Controlados o no controlados via `value`/`defaultValue` + `onValueChange`.
- Navegación con teclado (`Arrow`, `Home`, `End`) y soporte para vertical u horizontal.
- Prop `unmountOnExit` para desmontar paneles inactivos; `forceMount` en `TabPanel` para mantener contenido en el DOM.

```jsx
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@/web/components/ui";

<Tabs defaultValue="resumen">
  <TabList label="Resultados de análisis">
    <Tab value="resumen">Resumen</Tab>
    <Tab value="atributos">Atributos</Tab>
  </TabList>
  <TabPanels>
    <TabPanel value="resumen">Contenido principal</TabPanel>
    <TabPanel value="atributos">Tabla de atributos</TabPanel>
  </TabPanels>
</Tabs>
```

## Toasts (`ToastProvider`, `useToast`, `ToastAction`)
- `ToastProvider` gestiona pila, límite (`maxVisible`), posición (`top-right`, `top-center`, `bottom-right`, etc.) y temporizadores con pausa automática al perder foco/hover.
- `useToast()` expone `showToast`, `dismissToast`, `dismissAll` y `updateToast`.
- `ToastAction` provee un botón estilizado con los tonos del tema.

```jsx
import { ToastProvider, useToast, ToastAction } from "@/web/components/ui";

function Demo() {
  const { showToast } = useToast();
  return (
    <Button
      onClick={() =>
        showToast({
          title: "Análisis completado",
          description: "Tu Match Score es 82%",
          variant: "success",
          action: <ToastAction onClick={() => console.log("guardar")}>Guardar</ToastAction>,
        })
      }
    >
      Mostrar toast
    </Button>
  );
}

export function App() {
  return (
    <ToastProvider>
      <Demo />
    </ToastProvider>
  );
}
```

## Utilidades compartidas
- `focusRing`, `toneTokens` y `surfaceVariants` centralizan tokens de estilo.
- `Spinner` se exporta para estados de carga en otras vistas.
- `classNames` concatena condicionales sin dependencias adicionales.

> Para garantizar consistencia, importa los componentes desde el barrel `src/web/components/ui/index.js` y evita duplicar estilos ad-hoc en cada pantalla.
