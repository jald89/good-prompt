# Blueprint de UI inicial

Este documento ilustra la experiencia de usuario propuesta para el clon de PromptScore. Todos los textos deben estar disponibles en español e inglés.

## Landing Page
- **Hero principal**
  - Titular: “Evalúa tus prompts de IA al instante”.
  - Subtítulo explicando el beneficio.
  - Botón primario “Analizar prompt” que hace scroll al formulario.
  - Botón secundario “Ver cómo funciona” abre modal con video/tutorial.
- **Características clave** (tres columnas):
  1. Análisis IA en segundos.
  2. Insights detallados por atributo.
  3. Consejos prácticos para iterar.
- **Sección de flujo**: pasos 1-2-3 con iconografía.
- **Testimonios** (opcional) con carrusel accesible.
- **FAQ**: acordeón accesible con preguntas frecuentes.
- **Footer**: enlaces a Términos, Privacidad, Créditos, Copyright.
- **Toggle tema**: en el header, guarda preferencia en `localStorage`.

## Formulario de análisis
```
+-------------------------------------------------------+
| Prompt (textarea 2000 char máx, contador inferior)    |
|                                                       |
| [ Drag & drop o haz click para subir tu imagen ]      |
|  - Acepta PNG/JPG hasta 10MB                          |
|  - Muestra thumbnail + botón para eliminar            |
|                                                       |
| Idioma: [ES | EN]                                     |
|                                                       |
| [ Analizar ahora ]   [ Limpiar ]                      |
+-------------------------------------------------------+
```
- Validaciones inline y feedback en ARIA live regions.
- Uso de `react-hot-toast` para éxito/error.
- Estado de carga con spinner animado y texto accesible.

## Pantalla de resultados
```
+-----------------------+   +---------------------------+
| Match Score 82%       |   | Consejos de mejora        |
| Barra radial/semicírculo | | - Ajusta el estilo...     |
+-----------------------+   | - Añade contexto visual... |
                            +---------------------------+

Tabla de atributos
┌───────────────────────────────┬──────────┬────────────┐
│ Atributo                      │ Estado   │ Confianza  │
├───────────────────────────────┼──────────┼────────────┤
│ “lightning”                   │ Presente │ 0.92       │
│ “portrait orientation”        │ Parcial  │ 0.65       │
│ “ultra detailed background”   │ Ausente  │ 0.20       │
└───────────────────────────────┴──────────┴────────────┘
```
- Botones secundarios: “Nuevo análisis”, “Guardar en historial” (requiere login).
- CTA para encuesta de satisfacción (modal con escala Likert + comentario opcional).
- Compartir resultados: copiar link (si se guarda) o descargar PDF (future work).

## Sección de ayuda/FAQ
- Explicar límites de análisis, fuentes de IA, privacidad de imágenes.
- Proporcionar guía rápida para escribir prompts efectivos.
- Incluir video corto o step-by-step con capturas.

## Consideraciones de accesibilidad
- Componentes con roles y `aria-*` apropiados.
- Secuencia lógica de tabulación.
- Mensajes de error en texto, no solo color.
- Contraste mínimo 4.5:1.
- Etiquetas visibles para todos los campos.

## Estado vacío e indicadores
- Antes de primer análisis: ilustración ligera + texto motivador.
- En errores: tarjeta con icono, mensaje y botón “Reintentar”.
- Loading skeletons para sección de resultados.

## Diseño responsive
- Mobile: formulario y resultados en una sola columna, botones de acción sticky.
- Tablet: grid 2 columnas para resultados.
- Desktop: layout en 3 columnas (puntaje, tabla, consejos).

> Recurso: el kit de componentes base (Buttons, Cards, Tabs, Toasts) vive en `src/web/components/ui` para ser reutilizado en todas las pantallas.
