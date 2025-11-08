# PromptScore Clone – Especificación del Proyecto

Este documento describe el alcance completo para crear un clon avanzado de PromptScore, una plataforma donde las personas evalúan qué tan bien un prompt de texto se alinea con una imagen generada por IA. El objetivo es construir una solución moderna, escalable y accesible que sirva como referencia técnica para el equipo de desarrollo.

## Objetivos principales
- Permitir que cualquier persona ingrese un prompt de hasta 2000 caracteres y cargue una imagen generada por IA (PNG/JPG, máximo 10 MB y soporte drag & drop).
- Ofrecer un análisis automatizado mediante un modelo de visión por IA que devuelva un **Match Score** (0 – 100 %) y un desglose entre los atributos del prompt y los elementos detectados en la imagen.
- Proporcionar recomendaciones claras para mejorar el prompt en iteraciones futuras.

## Funcionalidad esencial
1. **Formulario de análisis**
   - Entrada de prompt con contador de caracteres.
   - Zona de carga con previsualización y validación de tamaño/formato.
   - Selector de idioma (ES/EN) para la interfaz y los resultados.
2. **Motor de análisis IA**
   - Procesa prompt + imagen, calcula el puntaje y devuelve diagnóstico detallado.
   - Limpieza automática de archivos temporales tras 1 hora.
3. **Gestión de uso**
   - Rate limiting de 30 análisis/día por IP sin cuenta.
   - Usuarios autenticados (OAuth con Google/Facebook) aumentan el límite a 100 análisis/día y pueden guardar historial.
4. **Experiencia de usuario**
   - Tema claro/oscuro persistente.
   - Notificaciones (éxito, error, advertencias) vía toasts.
   - Secciones informativas: landing, ayuda/FAQ, footer con términos, privacidad, créditos y copyright.
5. **Extras opcionales**
   - Historial y exportación de resultados.
   - Batch Analysis (subida de varios prompt+imagen).
   - Encuesta corta de satisfacción al finalizar cada análisis.

## Requisitos de accesibilidad y localización
- Cumplimiento WCAG 2.1 AA: contraste, etiquetas ARIA, navegación por teclado, foco visible.
- Textos y datos en español/inglés usando una librería de i18n (p. ej. `react-i18next`).
- Documentar cómo añadir nuevos idiomas y cadenas.

## Stack recomendado
- **Frontend**: React o Next.js + TypeScript + TailwindCSS. Estado manejado con React Query/TanStack Query y Zustand (o Context API) según complejidad.
- **Backend/API**: Node.js (Express, Fastify) o serverless en Vercel/Railway con TypeScript. Autenticación social mediante Passport.js o NextAuth.js.
- **IA**: Integración con OpenAI Vision, Replicate o proveedor similar. Encapsular la lógica en servicios modulares para facilitar sustituciones futuras.
- **Subidas de archivos**: `react-dropzone` + `multer`/`busboy` o servicio presignado (S3, Cloudflare R2).
- **Validación**: `zod` para contratos compartidos entre frontend y backend.
- **Notificaciones**: `react-hot-toast` o `sonner`.
- **Internacionalización**: `react-i18next` con soporte SSR en Next.js.
- **Testing**: Jest/Vitest + Testing Library (frontend) y Supertest (backend).
- **CI/CD**: GitHub Actions con pipelines para lint, tests, build y despliegue Docker.

## Flujo de usuario resumido
1. Usuario aterriza en la home y revisa la descripción del servicio.
2. Ingresa prompt, arrastra imagen, elige idioma y envía.
3. API procesa la petición, ejecuta el modelo de visión y devuelve:
   - Puntaje `matchScore` (0–100).
   - Tabla de atributos: cada atributo describe coincidencia (Presente, Parcial, Ausente) y confianza.
   - Consejos de mejora del prompt.
4. UI muestra resultados y ofrece acciones: iniciar nuevo análisis, guardar en historial (si está autenticado) o compartir feedback.
5. Tras 60 minutos, el backend elimina la imagen temporal.

## API sugerida (ejemplos)
- `POST /api/analyze` – Recibe `{ prompt, language }` + archivo. Responde con `{ matchScore, attributes[], recommendations[], analysisId }`.
- `POST /api/login` – Inicia sesión vía OAuth y emite JWT/sesión.
- `GET /api/history` – Devuelve análisis previos del usuario autenticado.
- `POST /api/feedback` – Recibe respuesta a encuesta (opcional).

## Documentación adicional
- [Arquitectura y componentes](docs/architecture.md)
- [Estructura de carpetas recomendada](docs/folder-structure.md)
- [Notas de UI inicial](docs/ui-blueprint.md)

## Kit de componentes base

Para acelerar el desarrollo del frontend se añadió un kit de componentes accesibles y tematizables dentro de `src/web/components/ui`. El paquete inicial incluye botones, tarjetas, pestañas y toasts construidos con TailwindCSS y patrones de accesibilidad (`role`, `aria-*`, navegación por teclado) listos para reutilizarse en todas las pantallas.

```jsx
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  ToastProvider,
  useToast,
} from "../src/web/components/ui";

function Example() {
  const { showToast } = useToast();

  return (
    <ToastProvider>
      <Card>
        <CardHeader>
          <CardTitle>Prueba de componentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="prompt">
            <TabList label="Modos de análisis">
              <Tab value="prompt">Prompt</Tab>
              <Tab value="imagen">Imagen</Tab>
            </TabList>
            <TabPanels>
              <TabPanel value="prompt">Evaluación textual.</TabPanel>
              <TabPanel value="imagen">Próximamente.</TabPanel>
            </TabPanels>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button onClick={() => showToast({ title: "Listo", description: "Acción completada", variant: "success" })}>
            Mostrar toast
          </Button>
        </CardFooter>
      </Card>
    </ToastProvider>
  );
}
```

> Sugerencia: exportar este kit como paquete compartido (`packages/ui`) al migrar a Turborepo para consumirlo desde apps de Next.js o React nativas.

## Próximos pasos sugeridos
1. Alinear al equipo sobre alcance y dependencias externas.
2. Configurar repositorio monorepo (Turborepo) o repos separados (frontend/backend) según preferencia.
3. Implementar pipeline de CI básico (lint + test) antes de integrar IA.
4. Desarrollar MVP con análisis single-shot y sin historial, luego iterar.

---

> **Nota**: La inspiración visual debe ser similar a PromptScore pero sin reutilizar activos protegidos. Diseños personalizados con branding genérico.

## Prompt-only analysis prototype

A lightweight Express service is included to experiment with prompt-only evaluation while image analysis capabilities are still being designed.

### Running the API locally

```bash
npm install
npm start
```

The service exposes a health endpoint at `GET /` and a prompt-only evaluator at `POST /api/analyze/prompt` accepting JSON payloads:

```json
{
  "prompt": "Cinematic portrait of a cyberpunk explorer, neon reflections, volumetric fog"
}
```

### Response example

```json
{
  "type": "prompt-only",
  "prompt": "Cinematic portrait of a cyberpunk explorer, neon reflections, volumetric fog",
  "analysis": {
    "promptQualityScore": 88,
    "charCount": 92,
    "wordCount": 13,
    "keywords": [
      { "word": "cinematic", "count": 1 },
      { "word": "cyberpunk", "count": 1 }
    ],
    "structure": {
      "sentenceCount": 1,
      "hasQuestions": false,
      "averageSentenceLength": 13
    },
    "suggestions": [
      "Divide el prompt en frases separadas para destacar elementos visuales y estilo.",
      "Describe estilo, iluminación, paleta de color o composición para orientar mejor al modelo.",
      "Incluye terminología de cámara o render si buscas un resultado fotográfico o 3D más preciso."
    ]
  },
  "metadata": {
    "evaluatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### Automated tests

```bash
npm test
```
