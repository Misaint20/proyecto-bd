import 'dotenv/config';
import app from "./app";
import prisma from "./lib/PrismaService";
import { logger } from "./utils/logger";
import os from 'os';

const PORT = parseInt(process.env.PORT || '3001', 10)

function getNetworkIp(): string | undefined {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        const ifaceList = interfaces[name];
        if (ifaceList) {
            for (const iface of ifaceList) {
                if (iface.family === 'IPv4' && !iface.internal) {
                    return iface.address;
                }
            }
        }
    }
    return undefined;
}

async function bootstrap() {
    try {
        await prisma.$connect();
        logger.info('[OK] Conexion a la base de datos establecida');

        app.listen(PORT, '0.0.0.0', () => {
            const networkIp = getNetworkIp();

            logger.info(`Servidor corriendo en el puerto ${PORT}`);
            logger.info(`  > Local:    http://localhost:${PORT}`);

            if (networkIp) {
                logger.info(`  > Red local: http://${networkIp}:${PORT} (accesible desde otros dispositivos en la red)`);
            } else {
                logger.warn("No se pudo detectar la IP de la red local.");
            }
        });
    } catch (error) {
        logger.error('[Error] Fallo al iniciar el servidor:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

bootstrap();