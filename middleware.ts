import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from './src/lib/supabase/server';

export async function middleware(request: NextRequest) {
  // Asegura que las cabeceras de request se propaguen a la respuesta
  const response = NextResponse.next({ request: { headers: request.headers } });

  // Crea el cliente SSR con el cookie store de la respuesta
  const supabase = createSupabaseServerClient(response.cookies);

  // Dispara la lectura/refresh de sesión; sincroniza cookies HTTP si hubo refresh
  await supabase.auth.getSession();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protege /dashboard: redirige a /login si no hay sesión
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    // Ejecuta el middleware en todas las rutas excepto assets estáticos y APIs de Next internals
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};


