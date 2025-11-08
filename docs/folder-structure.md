# Estructura de carpetas recomendada

Se propone un monorepo gestionado con Turborepo para compartir utilidades entre frontend y backend. Ajustar según necesidades del equipo.

```
promptscore-clone/
├─ apps/
│  ├─ web/                     # Next.js (App Router)
│  │  ├─ app/                  # Rutas, layouts, metadata
│  │  ├─ components/
│  │  │  ├─ ui/                # Componentes reutilizables (botones, inputs, modals)
│  │  │  ├─ analysis/          # Componentes específicos (PromptForm, ResultCard)
│  │  │  └─ layout/            # Header, Footer, ThemeToggle
│  │  ├─ features/
│  │  │  ├─ analyze/           # Hooks y lógica del análisis
│  │  │  ├─ history/           # Historial de usuario
│  │  │  └─ feedback/          # Encuesta post-análisis
│  │  ├─ hooks/
│  │  ├─ lib/                  # Clientes (API, i18n, analytics)
│  │  ├─ locales/              # Archivos de traducción ES/EN
│  │  ├─ styles/
│  │  └─ tests/                # Testing Library + Playwright
│  └─ api/                     # Express/Fastify o funciones serverless
│     ├─ src/
│     │  ├─ index.ts           # Entrypoint
│     │  ├─ app.ts             # Configuración Express/Fastify
│     │  ├─ routes/
│     │  │  ├─ analyze.ts
│     │  │  ├─ auth.ts
│     │  │  └─ history.ts
│     │  ├─ controllers/
│     │  ├─ services/
│     │  │  ├─ vision/
│     │  │  │  ├─ providers/
│     │  │  │  │  ├─ openai.ts
│     │  │  │  │  └─ replicate.ts
│     │  │  │  └─ index.ts
│     │  │  ├─ storage/
│     │  │  ├─ rate-limit/
│     │  │  └─ auth/
│     │  ├─ jobs/              # Limpieza de imágenes
│     │  ├─ middlewares/
│     │  ├─ schemas/           # Validaciones Zod
│     │  ├─ utils/
│     │  └─ tests/             # Jest/Vitest + Supertest
│     └─ package.json
├─ packages/
│  ├─ config/                  # ESLint, Tailwind, tsconfig compartidos
│  ├─ ui/                      # Design system opcional
│  └─ shared-types/            # Tipos Zod/TypeScript reutilizables
├─ infra/
│  ├─ docker/                  # Dockerfiles, compose para desarrollo
│  ├─ terraform/               # Infra opcional (S3, DB)
│  └─ github-actions/          # Plantillas YAML reutilizables
├─ docs/
│  ├─ architecture.md
│  ├─ folder-structure.md
│  └─ ui-blueprint.md
├─ .github/workflows/
│  ├─ ci.yml
│  └─ deploy.yml
├─ package.json
├─ turbo.json
└─ README.md
```

## Convenciones de nombres
- Componentes React en `PascalCase` (`PromptForm.tsx`).
- Hooks en `camelCase` con prefijo `use` (`useMatchScore.ts`).
- Schemas Zod en `PascalCaseSchema` (`AnalyzeRequestSchema`).
- Tests junto al archivo (`PromptForm.test.tsx`) o en `/tests` según preferencia.

## Scripts recomendados
- `pnpm lint` – Ejecuta ESLint/Prettier.
- `pnpm test` – Corre Jest/Vitest.
- `pnpm test:e2e` – Playwright.
- `pnpm dev --filter web` – Frontend.
- `pnpm dev --filter api` – Backend/API.

> También se puede optar por repos independientes (`frontend/`, `backend/`) si el equipo prefiere aislamiento total.
