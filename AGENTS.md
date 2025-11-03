⚠️ La IA (Cursor) debe seguir **ESTE DOCUMENTO DE MANERA OBLIGATORIA**.
Cualquier código generado deberá cumplir todas estas directrices
# AGENTS.md — Directrices de Arquitectura para **TreasuryLink**

Este documento define las reglas que **la IA (Cursor)** debe seguir para generar y mantener el código del proyecto **Full-Stack TreasuryLink**, asegurando arquitectura coherente, seguridad de nivel FinTech y cumplimiento estricto de la pila tecnológica.

---

## 1. Contexto Estratégico del Proyecto (FinTech)

**Objetivo Principal:**  
Construir un proyecto de portafolio de alto impacto que demuestre dominio en seguridad de datos, multitenancy y arquitectura SaaS.

**Dominio:** Finanzas / Tesorería — *manejo de datos sensibles*.

### Requisitos Críticos
- **1. Seguridad:**  
  - El sistema *debe* ser **multi-inquilino (multi-tenant)**.  
  - Privacidad del usuario = máxima prioridad.
- **2. Rendimiento:**  
  - Implementar **caching inteligente** para simular alto rendimiento.  
  - Mitigar latencia percibida del backend y de las políticas **RLS**.

---

## 2. Pila Tecnológica Estricta (Costo Cero)

Todo el código generado **debe** ajustarse estrictamente a esta pila.

| Componente | Herramienta | Uso Estratégico |
|-----------|-------------|-----------------|
| **Framework** | **Next.js (App Router)** | Priorizar **Server Components** y **SSR**. |
| **Backend / DB** | **Supabase (PostgreSQL)** | Fuente única de verdad para autenticación y datos. |
| **Seguridad DB** | **PostgreSQL RLS** | Las políticas deben usar `auth.uid()` para aislar datos por usuario. |
| **Autenticación** | `@supabase/ssr` | Sesiones mediante **cookies HTTP** (evitar tokens en cliente). |
| **Gestión de Datos** | `@tanstack/react-query` | Caching, SWR y revalidación. Reemplaza fetch directo. |
| **Lenguaje** | TypeScript | Tipado estricto en toda lógica y modelos. |

---

## 3. Reglas de Codificación y Arquitectura

### A. Reglas de Seguridad y Autenticación (Paso 2)

1. **Server-Side First:**  
   - Verificación de sesión, obtención de datos sensibles y llamadas privilegiadas a Supabase deben realizarse **siempre en Server Components** o **Middleware (Edge)**.

2. **Aislamiento mediante RLS:**  
   - Al consultar `transactions` o `bank_accounts` desde Server Components, asumir que **RLS está activo** → Supabase devolverá solo datos del usuario autenticado.

3. **Cookies Seguras:**  
   - La gestión de sesión y actualización de tokens **debe usar `@supabase/ssr`**, siempre vía cookies HTTP.

---

### B. Reglas de Gestión de Datos (Paso 3)

1. **Capa de Fetching Única:**  
   - En Client Components, todos los datos deben obtenerse mediante **TanStack Query** (`useQuery`).

2. **Optimización de Caching:**  
   - Configurar `staleTime` para implementar **Stale-While-Revalidate (SWR)** y evitar re-fetching innecesario.

3. **Asincronía Correcta:**  
   - Las funciones de fetching deben ser `async`/`await` para demostrar manejo eficiente de E/S.

---

### C. Reglas de Estilo y Convención

- **TypeScript Estricto:**  
  - Crear interfaces/tipos explícitos para tablas de Supabase  
    - `Transaction`  
    - `BankAccount`

- **Nomenclatura Estándar:**  
  - Hooks de React Query → `use{Entity}Query`  
    - Ej.: `useTransactionsQuery()`
  - Utilidades de Supabase en rutas dedicadas  
    - Ej.: `src/lib/supabase/client.ts`

- **Comentarios Explicativos:**  
  - Documentar el *por qué*, especialmente en Server Components:  
    - “Este Server Component verifica la sesión y aplica RLS de Supabase.”

---

## 4. Próximos Pasos (Hoja de Ruta)

1. **Paso 2 (Actual):**
   - Implementación de clientes de Supabase (SSR y cliente).
   - Configuración del middleware de autenticación.

2. **Paso 3 (Siguiente):**
   - Integración de TanStack Query en el dashboard.
   - Simulación de datos de Open Banking.

---

**Este archivo debe ser respetado por la IA (Cursor) como contrato arquitectónico obligatorio.**
