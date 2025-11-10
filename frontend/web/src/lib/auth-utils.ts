import { jwtVerify, JWTPayload } from 'jose';
import { UserRole } from '@/types/auth';

// Define la estructura del payload del JWT que esperas
interface CustomJWTPayload extends JWTPayload {
    role: UserRole;
    userId: string;
}

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

export async function verifyAndGetRole(token: string | undefined): Promise<UserRole | undefined> {
    if (!token) {
        return undefined;
    }
    
    try {
        // 1. Validar el token y su firma
        const { payload } = await jwtVerify(token, SECRET_KEY)
        
        // 2. Extraer el rol validado del payload (asegúrate que el backend lo incluye)
        const customPayload = payload as CustomJWTPayload;
        
        return customPayload.role;

    } catch (error) {
        // Si la firma es inválida, el token ha expirado, o ha sido alterado
        console.warn('JWT Verification Failed:', error);
        return undefined;
    }
}