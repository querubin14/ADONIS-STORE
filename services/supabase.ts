
import { createClient } from '@supabase/supabase-js';

// Hardcoded for stability against Vercel domain conflicts, but preferring env vars
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://womaohrhidudmpuawwag.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvbWFvaHJoaWR1ZG1wdWF3d2FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MzM1MzYsImV4cCI6MjA4NDAwOTUzNn0.5gCQdrT2CBIKbzCWqjocTleX_G5rfjKDbvJ2Q3lZ9xU';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables');
}

// Safe client creation to prevent app crash if vars are missing
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        storage: {
            from: () => ({
                upload: async () => ({ error: { message: 'FALTAN VARIABLES DE ENTORNO DE SUPABASE. Configura .env' }, data: null }),
                getPublicUrl: () => ({ data: { publicUrl: '' } })
            })
        }
    } as any;
