
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

const productsToRestore = [
    {
        name: 'Pulsera Ojo de Tigre y Ónix Negro Facetado',
        price: 50000,
        category: 'Joyas',
        subcategory: 'Pulseras',
        description: 'Pulsera de piedras naturales Ojo de Tigre y Ónix Negro Facetado. Diseño exclusivo y elegante.',
        images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=1000'],
        stock_quantity: 50,
        is_featured: true,
        tags: ['PREMIUM', 'JOYAS']
    },
    {
        name: 'Brazalete Piedra Ojo de Tigre y Dije de León en Acero',
        price: 60000,
        category: 'Joyas',
        subcategory: 'Pulseras',
        description: 'Brazalete con piedras Ojo de Tigre de alta calidad y dije de león en acero inoxidable.',
        images: ['https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&q=80&w=1000'], // Placeholder closer to description
        stock_quantity: 30,
        is_featured: true,
        tags: ['PREMIUM']
    },
    {
        name: 'Pulsera Dual Cuero Trenzado y Piedra',
        price: 60000,
        category: 'Joyas',
        subcategory: 'Pulseras',
        description: 'Combinación perfecta de cuero trenzado genuino y piedras naturales.',
        images: ['https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&q=80&w=1000'],
        stock_quantity: 40,
        is_featured: true,
        tags: ['PREMIUM']
    },
    {
        name: 'Pulsera Imperial de Piedra Volcánica',
        price: 50000,
        category: 'Joyas',
        subcategory: 'Pulseras',
        description: 'Pulsera hecha con piedras volcánicas y detalles imperiales.',
        images: ['https://images.unsplash.com/photo-1599643478518-17488fbbcd75?auto=format&fit=crop&q=80&w=1000'],
        stock_quantity: 25,
        is_featured: true,
        tags: ['PREMIUM', 'LIMITADO']
    },
    {
        name: 'Pulsera Cuero Trenzado y Acentos en Oro',
        price: 45000,
        category: 'Joyas',
        subcategory: 'Pulseras',
        description: 'Pulsera de cuero trenzado con elegantes acentos en tono oro.',
        images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1000'],
        stock_quantity: 60,
        is_featured: false,
        tags: ['PREMIUM']
    }
];

async function restore() {
    console.log('Starting restoration...');

    // 1. Ensure Joyas category exists
    const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('id')
        .eq('id', 'joyas')
        .single();

    if (catError && catError.code === 'PGRST116') {
        console.log('Creating Joyas category...');
        await supabase.from('categories').insert({
            id: 'joyas',
            name: 'Joyas',
            image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=1000'
        });
    }

    // 2. Insert Products
    for (const p of productsToRestore) {
        // Check if exists by name to avoid duplicates
        const { data: exist } = await supabase
            .from('products')
            .select('id')
            .eq('name', p.name)
            .single();

        if (!exist) {
            console.log(`Restoring: ${p.name}`);
            const { error } = await supabase.from('products').insert({
                ...p,
                savage_id: `RES-${Math.floor(Math.random() * 10000)}`
            });
            if (error) console.error(`Error inserting ${p.name}:`, error.message);
        } else {
            console.log(`Skipping: ${p.name} (already exists)`);
        }
    }

    console.log('Restoration complete.');
}

restore();
