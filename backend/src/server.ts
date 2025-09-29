import 'dotenv/config';
import app from "./app";
import prisma from "./lib/PrismaService";

const PORT = process.env.PORT || 3001

async function bootstrap() {
    try {
        await prisma.$connect();
        console.log('[OK] Conexion a la base de datos establecida');

        app.listen(PORT, () => {
            console.log('\n============================\n');
            console.log(`[INFO] Servidor de la API de la Bodega en funcionamiento en http://localhost:${PORT}`);
            console.log('\n============================\n');
        });
    } catch (error) {
        console.error('[Error] Fallo al iniciar el servidor:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

bootstrap();