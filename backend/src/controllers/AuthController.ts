import { Request, Response, NextFunction } from 'express';
import * as AuthService from '../services/AuthService';
import { HttpError } from '../middlewares/ErrorHandler';

/**
 * Maneja la petición POST /api/auth/login.
 */
export const loginController = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    if (!username ||!password) {
        return next(new HttpError('Se requiere nombre de usuario y contraseña.', 400));
    }

    try {
        const result = await AuthService.login(username, password);

        if (!result) {
            // Mensaje genérico para no dar pistas sobre la existencia del usuario (RNF04)
            return next(new HttpError('Credenciales inválidas.', 401)); 
        }

        // Respuesta con el token de acceso
        return res.status(200).json({ 
            message: 'Autenticación exitosa',
            access_token: result.access_token,
            user_info: {
                id: result.user.id_usuario,
                username: result.user.username,
                role: result.user.Rol.nombre
            }
        });
    } catch (error) {
        next(error);
    }
};