import * as jwt from 'jsonwebtoken';
import { validateUserCredentials } from './UsuarioService';
import { logger } from '../utils/logger';
import { AuthenticatedUser } from '../types/usuario';

// NOTA: La clave secreta debe ser leída de las variables de entorno (process.env.JWT_SECRET)
// Use una clave segura en su archivo.env: JWT_SECRET="su_clave_secreta_aqui"
const JWT_SECRET = process.env.JWT_SECRET || 'SUPER_CLAVE_SECRETA_DE_PRUEBA';
const JWT_EXPIRATION = '1d'; // Token válido por 1 día

/**
 * Tipo de datos que se guardará dentro del token JWT (payload).
 */
export interface JwtPayload {
    sub: string; // ID del usuario
    username: string;
    role: string; // Nombre del rol (para autorización rápida)
    // Se pueden añadir más datos, como permisos específicos
}

/**
 * Intenta autenticar un usuario y emite un token JWT si tiene éxito.
 */
export const login = async (username: string, pass: string): Promise<{ user: AuthenticatedUser, access_token: string } | null> => {
    // Paso 1: Validar las credenciales
    const userResult = await validateUserCredentials(username, pass);

    if (!userResult) {
        logger.warn(`Intento de login fallido para usuario: ${username}`, { context: 'AuthService' });
        return null;
    }
    
    // Paso 2: Crear el payload JWT (RNF04)
    const payload: JwtPayload = {
        sub: userResult.id_usuario,
        username: userResult.username,
        role: userResult.Rol.nombre, // Incluimos el rol para la autorización
    };

    // Paso 3: Firmar y generar el token
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

    logger.info(`Login exitoso para usuario: ${username} con rol: ${payload.role}`, { context: 'AuthService', userId: userResult.id_usuario });

    return {
        user: userResult,
        access_token: accessToken,
    };
};

/**
 * Verifica un token JWT y devuelve el payload si es válido.
 */
export const verifyToken = async (token: string): Promise<JwtPayload | null> => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        // Aseguramos que tenga las propiedades esperadas
        if (!decoded || !decoded.sub) return null;
        return {
            sub: decoded.sub,
            username: decoded.username,
            role: decoded.role,
        };
    } catch (err) {
        logger.warn('Token verification failed', { context: 'AuthService' });
        return null;
    }
};