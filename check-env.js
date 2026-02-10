
const REQUIRED_ENVS = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
];

const missingEnvs = REQUIRED_ENVS.filter(env => !process.env[env]);

if (missingEnvs.length > 0) {
    console.warn('\x1b[33m%s\x1b[0m', '⚠️ ADVERTENCIA DE DESPLIEGUE: Faltan variables de entorno:');
    missingEnvs.forEach(env => console.warn(`   - ${env}`));
    console.warn('\nLa aplicación se construirá en modo "Mock" (sin backend real).');
    // process.exit(1); // Do not block build, let app run in Mock mode
} else {
    console.log('\x1b[32m%s\x1b[0m', '✅ Variables de entorno verificadas correctamente.');
}
