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

/**
 * Endpoint para obtener el usuario actual logueado.
 */
export const getCurrentUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Intentamos obtener el token desde la cookie 'access_token' o header Authorization
        let token: string | undefined;

        const cookieHeader = (req.headers && (req.headers as any).cookie) || '';
        if (cookieHeader) {
            const cookies = cookieHeader.split(';').map((c: any) => c.trim());
            const tokenCookie = cookies.find((c: any) => c.startsWith('access_token='));
            if (tokenCookie) token = decodeURIComponent(tokenCookie.split('=')[1]);
        }

        if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'No autenticado' });
        }

        const payload = await AuthService.verifyToken(token);
        if (!payload) return res.status(401).json({ message: 'Token inválido' });

        // Buscar usuario en la base de datos
        const user = await (await import('../services/UsuarioService')).findUserById(payload.sub);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        return res.status(200).json({ user: { id: user.id_usuario, username: user.username, nombre: user.nombre, role: user.Rol.nombre } });
    } catch (err) {
        next(err);
    }
};

