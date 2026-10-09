import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * Rutas de acceso restringido bajo política Zero-Trust.
 * Cualquier sub-ruta de estos prefijos requiere sesión criptográficamente válida.
 */
const PROTECTED_ROUTES = ['/dashboard', '/admin'];

export async function middleware(request: NextRequest) {
  // Inicialización de la respuesta base que viajará hacia el cliente
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Instanciación del cliente de servidor conectado al ciclo de vida de las cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // 1. Sincroniza las cookies con el request entrante para Server Components
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

          // 2. Clona la respuesta con las cabeceras actualizadas
          supabaseResponse = NextResponse.next({
            request,
          });

          // 3. Sincroniza las cookies con la respuesta que recibe el navegador
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // ============================================================================
  // ZERO-TRUST CHECK: VALIDACIÓN CRIPTOGRÁFICA DEL JWT
  // ============================================================================
  // getUser() valida el token en el servidor de Supabase Auth, mitigando
  // cualquier intento de spoofing o falsificación en las cookies locales.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  // CASO 1: Acceso no autenticado a zona restringida
  if (!user && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    // Preserva el destino original como parámetro para post-login seguro
    loginUrl.searchParams.set('redirectTo', pathname);

    // Redirección inmediata devolviendo código HTTP 307 estricto
    return NextResponse.redirect(loginUrl, { status: 307 });
  }

  // CASO 2: Usuario ya autenticado intentando acceder a /login
  if (user && pathname === '/login') {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl, { status: 307 });
  }

  // Permite el tráfico con las cookies de sesión refrescadas
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Intercepta todas las rutas del sistema excepto:
     * - _next/static (archivos estáticos de compilación)
     * - _next/image (optimización dinámica de imágenes)
     * - favicon.ico (icono del navegador)
     * - Archivos públicos con extensión de imagen/fuente (.svg, .png, .jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
