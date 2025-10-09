import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from '../services/AuthService';
import { HttpError } from './ErrorHandler';

// NOTA: Usar la misma clave secreta que en AuthService.ts
const JWT_SECRET = process.env.JWT_SECRET || 'SUPER_CLAVE_SECRETA_DE_PRUEBA';

// Extendemos la Request de Express para añadir la información del usuario
export interface AuthRequest extends Request {
    user?: JwtPayload;
}

/**
 * Middleware para validar el JWT y autenticar al usuario.
 */
export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
    // 1. Obtener el token del encabezado (Bearer Token)
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new HttpError('Acceso denegado. No se proporcionó token.', 401));
    }

    const token = authHeader.split(' ')[1];

    try {
        // 2. Verificar el token (firma y expiración)
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

        // 3. Adjuntar el payload del usuario a la Request (para uso posterior en controladores/autorización)
        req.user = decoded;

        next(); // Token válido, continuar con la ruta
    } catch (err) {
        // 4. Manejar errores de expiración o token inválido
        if (err instanceof jwt.TokenExpiredError) {
            return next(new HttpError('Token expirado.', 401));
        }
        return next(new HttpError('Token inválido.', 401));
    }
};