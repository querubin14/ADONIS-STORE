
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env file
const envPath = path.resolve(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf-8');

const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        env[key.trim()] = value.trim();
    }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixVisibility() {
    console.log('Fixing Visibility Config...');

    const defaultConfig = {
        hero: true,
        categories: true,
        featured: true,
        lifestyle: true,
        drops: true
    };

    const { error } = await supabase.from('store_config').upsert({
        key: 'visibility_config',
        value: defaultConfig,
        updated_at: new Date().toISOString()
    });

    if (error) {
        console.error('Error fixing visibility:', error.message);
    } else {
        console.log('Visibility config reset to ALL TRUE.');
    }
}

async function fixHero() {
    console.log('Verifying Hero Slides...');
    const heroSlides = [
        {
            id: 'h1',
            title: 'COMPLEMENTAMOS',
            subtitle: 'TU ESTILO',
            buttonText: 'VER COLECCIÓN',
            buttonLink: '/category/Joyas',
            image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=2000'
        }
    ];

    const { error } = await supabase.from('store_config').upsert({
        key: 'hero_slides',
        value: heroSlides,
        updated_at: new Date().toISOString()
    });
    if (error) {
        console.error('Error fixing hero:', error.message);
    } else {
        console.log('Hero config reset.');
    }
}

async function run() {
    await fixVisibility();
    await fixHero();
    console.log('Fixes applied. Please refresh the page.');
}

run();
