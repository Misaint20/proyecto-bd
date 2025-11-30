import { ROLE_ROUTE_MAP, UserRole } from '@/types/auth';
import api from '@/lib/apiClient';

interface LoginResult {
    success: boolean;
    user?: {
        nombre: string;
        role: UserRole;
    };
    errorMessage?: string;
}

export async function login(username: string, password: string): Promise<LoginResult> {
    const res = await api.post('/api/auth/login', { username, password });

    if (res.success) {
        // `res.data` expected to contain `{ user, ... }`
        const user = res.data?.user;
        return { success: true, user };
    }

    return { success: false, errorMessage: res.errorMessage || 'Error de credenciales. Intenta de nuevo.' };
}

/**
 * Obtiene la ruta de dashboard basada en el rol.
 * @param role Rol del usuario.
 * @returns La ruta correspondiente al dashboard o la ruta raíz.
 */
export function getDashboardPath(role: UserRole): string {
    // Usamos el mapeo de roles que definimos previamente
    return ROLE_ROUTE_MAP[role] || '/';
}