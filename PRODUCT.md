# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Negocios locales y PyMEs mexicanas (cafeterías, restaurantes, barberías, tiendas, consultorios, servicios) cuyo contacto con clientes vive en tarjetas impresas, carteles, menús de papel, sellos de cliente frecuente y un número de WhatsApp. El comprador es el dueño o encargado del negocio: decide rápido, cuida cada peso y necesita ver algo concreto (un QR, una tarjeta, una web) antes de pensar en automatización o IA.

## Product Purpose

ForgeX construye las herramientas digitales que un negocio necesita y las hace crecer por niveles. No vende publicidad ni gestiona campañas pagadas: el negocio recibe un sistema propio que le permite ser encontrado, facilitar el contacto, recibir interacciones, fidelizar y, en los niveles altos, automatizar e incorporar IA.

Progresión del producto: presencia → interacción → información → automatización → inteligencia. Cada nivel conserva todo lo del anterior; subir de nivel no borra nada.

## Positioning

La puerta de entrada es muy económica y física: un QR y una tarjeta NFC que abren el Mini Hub del negocio. Desde ahí el cliente sube de nivel solo cuando lo necesita, sin rehacer lo que ya tiene. Frase de producto: "Pon tu negocio al alcance de un toque."

## Escalera comercial (definida)

| Nivel | Verbo | Qué es | Precio provisional |
|---|---|---|---|
| Básico | Conecta | QR + NFC + Mini Hub: una micro-página de acción (menú, tarjeta de fidelidad, reseña, WhatsApp). No es la web completa del negocio. | $199 MXN/mes |
| Plus | Presenta | La web completa del negocio (inicio, menú o catálogo interactivo, galería, ubicación, promociones propias, formularios básicos) + todo Básico. | $399 MXN/mes |
| Pro | Interactúa | Más contenido, personalización, formularios ampliados, mejor analítica y fidelización ampliada. | $699 MXN/mes |
| Advance | Automatiza | Infraestructura para digitalizar y automatizar operaciones. Puede gestionar información, procesos e integraciones según la solución implementada. | $1,099 MXN/mes |
| Max | Piensa y atiende | La capa de inteligencia: combina automatización con IA para interpretar información y asistir determinados procesos. | $1,999 MXN/mes |

- Los precios son de lanzamiento y pueden cambiar. Básico y Plus están más definidos; Pro, Advance y Max siguen en planeación. Siempre se muestra precio, con una nota de que es provisional.
- Básico puede requerir una activación inicial por materiales (tarjeta NFC, impresión, configuración); la cifra no está definida.
- Planes destacados comercialmente: Básico (entrada), Pro (recomendado), Max (premium).

## Operating Context

- Landing de una sola página con un asistente "Encontrar mi plan" (Gemini vía `/api/diagnose`, con respuesta determinista si no hay API key) que recomienda uno de los cinco niveles.
- `/api/audit-inquiry` registra la solicitud de contacto solo en consola y devuelve un folio; todavía no envía correo ni guarda en ningún sistema.
- Todo el copy en español de México; precios en MXN.

## Capabilities and Constraints

- React 19 + Vite + Tailwind 4 + Motion, servido por Express (`server.ts`).
- **Datos como capa del sistema, no como especificación.** Todavía se define qué datos se recopilan, cómo se estructuran, qué paneles existen, qué CRM se usa y los límites de cada nivel. La página puede decir que Pro y Max trabajan con información, procesos, automatizaciones e integraciones, pero no debe describir una arquitectura de datos.
- Prohibido afirmar: que ForgeX almacena automáticamente los datos de los clientes, que un nivel incluye un CRM completo, que existe una base de datos empresarial propia, historiales completos o perfiles inteligentes de consumidores.

## Brand Commitments

- Nombre: **ForgeX**. Tagline de marca: "Forjamos tu ventaja competitiva."
- Voz: tecnológica pero accesible, directa, sin artificios. Nada de clichés de marketing ni promesas de resultados cuantificados sin evidencia.
- Concepto de la landing: "Nada desaparece; todo se transforma." El negocio no tira lo que ya tiene (tarjetas, menú, WhatsApp); lo convierte en herramientas digitales, y cada nivel conserva el anterior.
- Paleta obligatoria del sistema de diseño ForgeX: obsidiana, vino ciruela, champagne metálico, lila.

## No se comunica todavía

- Publicidad pagada (Google Ads, Meta Ads, compra de tráfico): fuera del producto. Se puede decir que ForgeX no compra anuncios.
- Add-ons, plugins y el estatus Ultra / Ultra Infinity: existen como concepto interno pero no están listos para la página.
- Tamaño del equipo.

## Evidence on Hand

- No hay clientes, testimonios ni métricas reales. Cualquier ejemplo (p. ej. "Café Central") se rotula como ilustrativo. No inventar cifras.

## Product Principles

1. Entrar barato y concreto: primero un toque, después todo lo demás.
2. Crecer sin rehacer: cada nivel conserva el anterior.
3. Herramientas propias, no publicidad.
4. IA solo donde aporta, y en el nivel que la incluye.
5. Honestidad sobre lo que todavía se está definiendo.
