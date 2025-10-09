import { Response, NextFunction } from 'express';
import { AuthRequest } from './AuthMiddleware';
import { HttpError } from './ErrorHandler';
import { Rol_nombre as RolNombre } from '@prisma/client';

/**
 * Generador de middleware para verificar roles específicos (RBAC).
 */
export const authorizeRoles = (allowedRoles: RolNombre) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        // 1. Verificar si el usuario está autenticado
        if (!req.user) {
            // Este caso debería ser capturado por authenticateJWT
            return next(new HttpError('No autenticado.', 401));
        }

        const userRole = req.user.role;
        
        // 2. Verificar si el rol del usuario está permitido (RNF04)
        if (userRole === allowedRoles || userRole === RolNombre.Administrador) {
            // El Administrador siempre tiene acceso total
            next();
        } else {
            return next(new HttpError('Acceso prohibido. Rol no autorizado.', 403));
        }
    };
};