
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://womaohrhidudmpuawwag.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvbWFvaHJoaWR1ZG1wdWF3d2FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MzM1MzYsImV4cCI6MjA4NDAwOTUzNn0.5gCQdrT2CBIKbzCWqjocTleX_G5rfjKDbvJ2Q3lZ9xU';

console.log("Testing connection to:", supabaseUrl);
console.log("With key:", supabaseAnonKey.substring(0, 20) + "...");

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    try {
        const { data, error } = await supabase.from('products').select('*').limit(1);
        if (error) {
            console.error("Connection FAILED:", error.message);
            console.error("Details:", error);
        } else {
            console.log("Connection SUCCESS! Data retrieved:", data);
        }
    } catch (err) {
        console.error("Unexpected error:", err);
    }
}

testConnection();
