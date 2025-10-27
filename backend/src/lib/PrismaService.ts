import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from "@prisma/client";

const NODE_ENV = process.env.NODE_ENV;

// Configuración del adaptador MariaDB para Prisma
const adapter = new PrismaMariaDb({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '3306'),
    connectionLimit: 10,
});
// En proceso de desarrollo y pruebas, no modificar esta configuracion de momento

const prisma = new PrismaClient({
    log: NODE_ENV === "development" ? ["query", "error", "warn"] : ["error", 'warn'],
});

export default prisma;