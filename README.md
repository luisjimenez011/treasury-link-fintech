# TreasuryLink (FinTech)

Estoy construyendo una aplicación FinTech llamada TreasuryLink con Next.js (App Router) y Supabase. El proyecto usa TypeScript y el objetivo principal es demostrar Seguridad a Nivel de Fila (RLS) en PostgreSQL para aislar los datos financieros del usuario. Usaré @supabase/ssr para la autenticación del lado del servidor (SSR) y @tanstack/react-query para el caching.

## Arquitectura FinTech

- **Seguridad**: Implementación de RLS (Row-Level Security) en PostgreSQL para aislamiento de datos multi‑inquilino usando `auth.uid()` como base de las políticas.
- **Rendimiento**: Uso de TanStack Query con estrategia SWR (`staleTime` configurado) para caching inteligente y reducción de latencia percibida en el frontend.
- **Valor**: Solución dirigida a la falta de visibilidad y previsión de la tesorería consolidada, mostrando saldos y flujo neto proyectado a partir de múltiples cuentas.

## Impacto en el Negocio (CV Ready)

Este proyecto resuelve el problema de la "Nula Visibilidad y Previsión de Tesorería" al consolidar cuentas bancarias, exponer el saldo total y proyectar el flujo neto de caja de forma rápida y segura.

- La Proyección de Flujo de Caja es el valor clave del producto: permite anticipar necesidades de liquidez y tomar decisiones informadas.
- Este resultado es demostrable y cuantificable para incluir en el CV: construcción de una demo FinTech con RLS (seguridad), SSR + caching (rendimiento) y analítica de tesorería consolidada (valor).