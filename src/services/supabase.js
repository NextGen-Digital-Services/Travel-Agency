// Safe Supabase Environment Configuration Helper
// Prevents runtime errors such as "Cannot read properties of null (reading 'auth')"
// if Supabase credentials are missing or being configured on Vercel environment variables.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const getSupabaseConfig = () => {
  if (!isSupabaseConfigured) {
    return {
      configured: false,
      url: null,
      key: null,
      message: 'Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are not set. The application is running smoothly using the async LocalStorage data layer.'
    };
  }
  return {
    configured: true,
    url: supabaseUrl,
    key: supabaseAnonKey
  };
};
