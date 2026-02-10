
import { createClient } from '@supabase/supabase-js';

// Retrieve env vars
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug log (safe for production as keys are public anyway, but good to know if they exist)
console.log('Initializing Supabase Client:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    url: supabaseUrl ? supabaseUrl.substring(0, 15) + '...' : 'MISSING'
});

// Force check to ensure valid string before creating client
const isValidConfig = supabaseUrl && supabaseAnonKey &&
    typeof supabaseUrl === 'string' &&
    supabaseUrl.startsWith('http');

if (!isValidConfig) {
    console.error('CRITICAL: Missing or invalid Supabase environment variables. Using Mock Client.');
}

// Export safe client
export const supabase = isValidConfig
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        from: () => ({
            select: () => ({ data: [], error: null }),
            insert: () => ({ data: null, error: { message: 'Mock Error: Supabase not configured' } }),
            update: () => ({ data: null, error: { message: 'Mock Error: Supabase not configured' } }),
            delete: () => ({ data: null, error: { message: 'Mock Error: Supabase not configured' } }),
            upsert: () => ({ data: null, error: { message: 'Mock Error: Supabase not configured' } }),
            order: () => ({ data: [], error: null }), // Chainable mock
        }),
        storage: {
            from: () => ({
                upload: async () => ({ error: { message: 'FALTAN VARIABLES DE ENTORNO DE SUPABASE. Configura .env' }, data: null }),
                getPublicUrl: () => ({ data: { publicUrl: '' } })
            })
        },
        auth: {
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signInWithPassword: async () => ({ error: { message: 'Supabase not configured' } }),
            signInWithOtp: async () => ({ error: { message: 'Supabase not configured' } }),
            signOut: async () => ({ error: null })
        }
    } as any;
