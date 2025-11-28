import { api } from "@/lib/apiClient";

export const logout = async () => {
    try {
        const result = await api.post('/api/auth/logout');

        if (result && result.success) {
            localStorage.removeItem('user');
            if (typeof window !== 'undefined') window.location.href = '/';
            return { message: 'Sesión cerrada exitosamente' };
        }

        console.error('Error al cerrar sesión:', result?.errorMessage);
        return { message: result?.errorMessage || 'Error al cerrar sesión' };
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        return { message: 'Error al cerrar sesión' };
    }
}