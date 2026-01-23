
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://womaohrhidudmpuawwag.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvbWFvaHJoaWR1ZG1wdWF3d2FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MzM1MzYsImV4cCI6MjA4NDAwOTUzNn0.5gCQdrT2CBIKbzCWqjocTleX_G5rfjKDbvJ2Q3lZ9xU';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Faltan variables de entorno de Supabase');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
