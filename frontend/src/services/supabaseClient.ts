import { createClient } from '@supabase/supabase-js'; // Cliente oficial de Supabase

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jcsgixxatmqzpdcflevw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_vCQ09c8ZXEKvQeNipnC5gA_d8VQnASl';

/**
 * Cliente oficial de Supabase configurado con las credenciales del proyecto.
 * Utilizado para autenticación de usuarios y subida de fotografías médicas a Supabase Storage.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
