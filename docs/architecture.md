# Arquitectura de PromptScore Clone

La solución se concibe como una aplicación web full-stack dividida en frontend, backend/API y servicios auxiliares (almacenamiento temporal de imágenes, proveedor IA y monitoreo). Se recomienda utilizar un enfoque modular para permitir iteraciones rápidas.

## Visión general
```
[Cliente React/Next.js] ⇄ [API Gateway / Serverless Functions] ⇄ [Servicios internos]
                                                    ├─ Servicio de análisis IA
                                                    ├─ Almacenamiento temporal (S3/R2)
                                                    ├─ Base de datos (PostgreSQL)
                                                    └─ Servicio de colas (opcional)
```

### Frontend
- **Framework**: Next.js 14 con App Router para aprovechar SSR/SSG y mejorar SEO de la landing.
- **UI**: TailwindCSS + componentes accesibles (Headless UI, Radix UI).
- **Estado**: TanStack Query para peticiones a la API y caché. Zustand para estado global ligero (tema, preferencias).
- **Internacionalización**: `next-i18next` o `react-i18next` con namespaces para página, prompts y resultados.
- **Gestión de archivos**: `react-dropzone` para arrastrar/soltar, con previsualización y validación client-side.
- **Autenticación**: NextAuth.js con adaptadores para Google y Facebook.

### Backend/API
- **Runtime**: Node.js 20+ (Express/Fastify) desplegado en contenedores o funciones serverless.
- **Endpoints**: REST con rutas versionadas (`/api/v1`). Posible extensión a GraphQL o TRPC para compartir contratos.
- **Seguridad**: CSRF (si aplica), rate limiting por IP/usuario, validaciones con `zod` y sanitización de entradas.
- **Almacenamiento**:
  - Base de datos relacional (PostgreSQL/Supabase) para usuarios, historial, límites.
  - Redis para rate limiting y caché de tokens.
  - Bucket S3 compatible para archivos temporales con reglas de lifecycle (TTL 1h).
- **Servicios de IA**: Módulo `visionService` que encapsula proveedor externo (OpenAI Vision, Replicate). Debe exponer una interfaz genérica:
  ```ts
  interface VisionAnalysisRequest {
    prompt: string;
    imageUrl: string;
    language: 'es' | 'en';
  }

  interface VisionAnalysisResponse {
    matchScore: number;
    attributes: Array<{ label: string; status: 'present' | 'partial' | 'missing'; confidence: number }>;
    recommendations: string[];
    rawModelOutput?: unknown;
  }
  ```
- **Procesamiento**: La API recibe el archivo, lo sube a almacenamiento temporal, llama al servicio de IA y devuelve respuesta normalizada.
- **Eliminación**: Job programado (cron/queue) para borrar archivos > 60 min. Se puede usar Cloudflare R2 lifecycle o AWS S3 lifecycle rules.

### Autenticación y cuotas
- OAuth 2.0 mediante NextAuth/Passport con proveedores Google y Facebook.
- Rate limiting basado en Redis (`@upstash/ratelimit`, `rate-limiter-flexible`).
- Tabla `usage_logs` para registrar cada análisis y permitir auditorías.

### Extras opcionales
- **Historial**: Guardar resultados normalizados en tabla `analyses`. Permitir filtrado por fecha y exportación (CSV/JSON).
- **Batch Analysis**: Endpoint `POST /api/batch-analyze` que acepta varias parejas prompt-imagen; procesar en cola (BullMQ).
- **Encuesta post-análisis**: Guardar en tabla `feedback` con respuesta anónima vinculada a `analysisId`.

## Escalabilidad
- Desplegar frontend como app estática en Vercel/Netlify.
- Backend con contenedores Docker en Railway/Fly.io o funciones serverless.
- CDN para assets estáticos.
- Observabilidad con OpenTelemetry + APM (Datadog, Sentry) y logging estructurado (pino/winston).

## CI/CD
- GitHub Actions con jobs separados:
  1. `lint`: ESLint + Prettier check.
  2. `test`: Jest/Vitest y pruebas e2e (Playwright) opcionales.
  3. `build`: Generar artefactos (frontend, backend Docker image).
  4. `deploy`: Publicar a Vercel/Railway tras aprobación manual.
- Soporte para dependabot/renovate.

## Accesibilidad
- Uso de componentes semánticos y roles ARIA.
- Tests automáticos con axe-core/Pa11y en CI.
- Tema oscuro/claro basado en preferencia del sistema (`prefers-color-scheme`).

## Futuras extensiones
- Integrar otros proveedores IA (Azure Vision, Stability AI) implementando la interfaz `VisionAnalysisService`.
- Añadir suscripciones premium con límites superiores y dashboards de uso.
- API pública con claves y facturación por análisis.
