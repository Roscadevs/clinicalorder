import { createBrowserClient } from '@supabase/ssr';

/**
 * Cliente de navegador para Supabase Auth con SSR.
 * Almacena y refresca los tokens en Cookies HTTP para habilitar
 * el control perimetral en el Middleware de Next.js sin depender de localStorage.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
