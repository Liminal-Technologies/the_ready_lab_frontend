import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ibxhnlcbsqkrkwbfmxto.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Only create client if key is provided
let supabaseAdmin: SupabaseClient | null = null;

if (SUPABASE_SERVICE_ROLE_KEY) {
  supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
} else {
  console.warn('[SUPABASE] SUPABASE_SERVICE_ROLE_KEY not set - auth verification will fail');
}

export { supabaseAdmin };

export async function verifySupabaseToken(authHeader: string | null) {
  if (!supabaseAdmin) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY not configured');
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header');
  }

  const token = authHeader.replace('Bearer ', '');

  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data.user) {
    throw new Error('Invalid or expired token');
  }

  return data.user;
}
