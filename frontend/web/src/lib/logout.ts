import { api } from "@/lib/apiClient";
import userStore from '@/lib/userStore'

export const logout = async () => {
    try {
        const result = await api.post('/api/auth/logout');

        // Clear client state regardless of backend result to update UI immediately
        userStore.clearUser()

        if (result && result.success) {
            if (typeof window !== 'undefined') window.location.href = '/';
            return { message: 'Sesión cerrada exitosamente' };
        }

        console.error('Error al cerrar sesión:', result?.errorMessage);
        if (typeof window !== 'undefined') window.location.href = '/';
        return { message: result?.errorMessage || 'Error al cerrar sesión' };
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        userStore.clearUser()
        if (typeof window !== 'undefined') window.location.href = '/';
        return { message: 'Error al cerrar sesión' };
    }
}