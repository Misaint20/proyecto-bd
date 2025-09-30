import morgan from "morgan";
import { logger, morganStream } from "../utils/logger";

const NODE_ENV = process.env.NODE_ENV || "development";

/**
 * Middleware de Morgan para registrar las peticiones HTTP.
 * En desarrollo: usa el formato 'dev' (colorido, conciso).
 * En produccion: usa un formato mas detallado y lo canaliza a Winston.
 * @returns Express Middleware
 */

export const requestLogger = () => {
    if (NODE_ENV === "production") {
        // Formato detallado para producción
        return morgan(
            ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms ":referrer" ":user-agent"',
            { stream: morganStream }
        );
    } else {
        // Formato conciso para desarrollo
        return morgan('dev', { stream: morganStream });
    }
}