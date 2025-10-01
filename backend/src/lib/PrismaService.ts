import { PrismaClient } from "@prisma/client";

const NODE_ENV = process.env.NODE_ENV;

const prisma = new PrismaClient({
    log: NODE_ENV === "development" ? ["query", "error", "warn"] : ["error", 'warn'],
});

export default prisma;