import 'dotenv/config';
import app from "./app";
import prisma from "./lib/PrismaService";
import { logger } from "./utils/logger";

const PORT = process.env.PORT || 3001

async function bootstrap() {
    try {
        await prisma.$connect();
        logger.info('[OK] Conexion a la base de datos establecida');

        app.listen(PORT, () => {
            logger.debug('============================');
            logger.debug(`[INFO] Servidor de la API de la Bodega en funcionamiento en http://localhost:${PORT}`);
            logger.debug('============================');
        });
    } catch (error) {
        logger.error('[Error] Fallo al iniciar el servidor:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

bootstrap();