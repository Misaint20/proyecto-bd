import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from "../generated/prisma/client";

const NODE_ENV = process.env.NODE_ENV;
const DATABASE_URL = process.env.DATABASE_URL;

// Configuración del adaptador MariaDB para Prisma
const adapter = new PrismaMariaDb({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT ?? '3306'),
    connectionLimit: 10,
});
// En proceso de desarrollo y pruebas, no modificar esta configuracion de momento

const prisma = new PrismaClient({
    adapter,
    log: NODE_ENV === "development" ? ["query", "error", "warn"] : ["error", 'warn'],
});

export default prisma;