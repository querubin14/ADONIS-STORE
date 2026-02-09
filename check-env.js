
const REQUIRED_ENVS = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
];

const missingEnvs = REQUIRED_ENVS.filter(env => !process.env[env]);

if (missingEnvs.length > 0) {
    console.error('\x1b[31m%s\x1b[0m', '❌ ERROR DE DESPLIEGUE: Faltan variables de entorno críticas:');
    missingEnvs.forEach(env => console.error(`   - ${env}`));
    console.error('\nConfigúralas en el panel de Vercel para que la web funcione.\n');
    process.exit(1); // Esto detiene el Build de Vercel
} else {
    console.log('\x1b[32m%s\x1b[0m', '✅ Variables de entorno verificadas correctamente.');
}
