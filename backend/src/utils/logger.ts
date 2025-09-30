import { createLogger, format, transports, Logger } from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, printf, colorize } = format;
const LOG_DIR = 'logs';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Formato para desarrollo (Visualizar en consola)
const devFormat = printf(({ level, message, timestamp, context }) => {
    return `${timestamp} [${context || 'App'}] ${level}: ${message}`;
});

// Formato para producción (Archivo)
const prodFormat = combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.json()
);

// Transportes de Archivo (para producción y desarrollo)
const fileTransport = new transports.DailyRotateFile({
    filename: `${LOG_DIR}/combined-%DATE%.log`, // logs/combined-2025-09-29.log
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true, // Comprimir logs antiguos
    maxSize: '20m', // Tamaño máximo por archivo
    maxFiles: '14d', // Mantener logs por 14 días
    level: 'info', // Nivel mínimo para logs combinados
    format: prodFormat,
});

const errorFileTransport = new transports.DailyRotateFile({
    filename: `${LOG_DIR}/errors-%DATE%.log`, // Archivo solo para errores
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d', // Mantener logs de error por 30 días
    level: 'error', // Solo registrar errores
    format: prodFormat,
});

// Transportes de Consola (solo en desarrollo)
const consoleTransport = new transports.Console({
    level: 'debug', // Mostrar debug en desarrollo
    format: combine(
        colorize(), // Colorear niveles en la consola
        timestamp({ format: 'HH:mm:ss' }),
        devFormat
    ),
});

export const logger: Logger = createLogger({
    level: NODE_ENV === 'production' ? 'info' : 'debug',

    transports: [
        fileTransport,
        errorFileTransport,
        consoleTransport,
    ],
    exceptionHandlers: [],
    rejectionHandlers: [],
});

// Necesario para la integración con Morgan
export const morganStream = {
    write: (message: string) => {
        // Morgan a veces añade un salto de línea, lo limpiamos
        logger.info(message.trim(), { context: 'HTTP' });
    },
};