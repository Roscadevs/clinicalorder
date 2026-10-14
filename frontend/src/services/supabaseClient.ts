import { createClient } from '@supabase/supabase-js'; // Cliente oficial de Supabase

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Cliente oficial de Supabase configurado con las credenciales del proyecto.
 * Utilizado para autenticación de usuarios y subida de fotografías médicas a Supabase Storage.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
    autoRefreshToken: true,
    detectSessionInUrl: true,
    persistSession: true,
  },
});
