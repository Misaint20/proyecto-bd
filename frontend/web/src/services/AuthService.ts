import { ROLE_ROUTE_MAP, UserRole } from '@/types/auth'; 
interface LoginResult {
    success: boolean;
    role?: UserRole;
    errorMessage?: string;
}

export async function login(username: string, password: string): Promise<LoginResult> {
    // Llamamos a nuestro API Route de Next.js que actúa como proxy
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
        const role = data.role as UserRole;
        return {
            success: true,
            role: role
        };
    } else {
        // El backend devolvió un error (ej: credenciales incorrectas, status 401)
        return {
            success: false,
            errorMessage: data.message || 'Error de credenciales. Intenta de nuevo.'
        };
    }
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