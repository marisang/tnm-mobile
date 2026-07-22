import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client para operações públicas/autenticadas
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client com privilégios administrativos (use com cuidado)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export default supabase;
