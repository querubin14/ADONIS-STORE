
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

const enhancements = [
    {
        nameMatch: 'Ojo de Tigre y Ónix',
        newTitle: 'Pulsera Premium Ojo de Tigre & Ónix Negro - Edición Facetada',
        newDesc: 'Descubre el equilibrio perfecto entre protección y estilo. Esta pulsera artesanal combina la chatoyancia dorada del Ojo de Tigre natural con la profundidad del Ónix Negro facetado. Cada cuenta ha sido seleccionada manualmente para garantizar un brillo superior. El diseño elástico de alta resistencia asegura un ajuste cómodo y duradero. Ideal para elevar cualquier outfit urbano o formal con un toque de sofisticación mística.'
    },
    {
        nameMatch: 'Dije de León',
        newTitle: 'Brazalete Royal Lion - Ojo de Tigre y Acero Inoxidable',
        newDesc: 'Domina tu entorno con el Brazalete Royal Lion. Protagonizado por un imponente dije de león en acero inoxidable de grado quirúrgico, símbolo de fuerza y liderazgo. Las cuentas de Ojo de Tigre natural de 8mm aportan una energía vibrante y una estética de lujo. Acabados premium y durabilidad excepcional para el hombre moderno que no teme destacar.'
    },
    {
        nameMatch: 'Dual Cuero',
        newTitle: 'Pulsera Híbrida - Cuero Genuino Trenzado y Piedras Naturales',
        newDesc: 'La fusión definitiva de texturas. Esta pieza única integra la rusticidad elegante del cuero genuino trenzado a mano con la frialdad sofisticada de las piedras naturales. Un cierre magnético de acero inoxidable proporciona seguridad y facilidad de uso. Diseñada para ser el complemento diario perfecto, resistiendo el ritmo de vida urbano con estilo inalterable.'
    },
    {
        nameMatch: 'Piedra Volcánica',
        newTitle: 'Pulsera Imperial Black - Piedra Volcánica y Corona',
        newDesc: 'Una declaración de poder. La Pulsera Imperial Black destaca por sus cuentas de piedra volcánica natural, conocidas por su textura porosa y mate única, contrastadas con un dije de corona real en aleación de alta calidad. Perfecta para quienes buscan un accesorio con carácter, elegancia oscura y una conexión con la naturaleza elemental.'
    },
    {
        nameMatch: 'Cuero Trenzado y Acentos',
        newTitle: 'Pulsera Gold Accent - Cuero Trenzado Premium',
        newDesc: 'Minimalismo de lujo. Esta pulsera combina cuero trenzado de alta densidad con sutiles pero impactantes acentos en tono oro. Su perfil delgado la hace ideal para usar sola o combinada (stacking) con un reloj. El cierre de seguridad garantiza que esta pieza esencial de tu colección permanezca contigo en todo momento.'
    }
];

async function enhance() {
    console.log('Starting product enhancement...');

    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', 'Joyas');

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    console.log(`Found ${products.length} jewelry products.`);

    for (const p of products) {
        let match = null;
        for (const e of enhancements) {
            if (p.name.includes(e.nameMatch) || p.description?.includes(e.nameMatch)) {
                match = e;
                break;
            }
        }

        if (match) {
            console.log(`Updating: ${p.name} -> ${match.newTitle}`);
            const { error: updateError } = await supabase
                .from('products')
                .update({
                    name: match.newTitle,
                    description: match.newDesc,
                    // Ensure tags are robust
                    tags: ['PREMIUM', 'JOYAS', 'EXCLUSIVO', ...((p.tags || []).filter(t => t !== 'PREMIUM' && t !== 'JOYAS'))]
                })
                .eq('id', p.id);

            if (updateError) console.error(`Error updating ${p.name}:`, updateError.message);
        }
    }
    console.log('Enhancement complete.');
}

enhance();
