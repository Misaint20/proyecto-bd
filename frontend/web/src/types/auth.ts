/** Definición de los roles válidos */
export type UserRole =
    | 'Administrador'
    | 'Enologo_Productor'
    | 'Encargado_de_Bodega'
    | 'Vendedor';

/** Estructura de la respuesta exitosa del backend */
export interface LoginResponse {
    message: string;
    access_token: string;
    user_info: {
        id: string;
        username: string;
        role: UserRole; // Usamos el tipo UserRole
    };
}

/** Mapeo de roles a rutas protegidas */
export const ROLE_ROUTE_MAP: Record<UserRole, string> = {
    'Administrador': '/admin',
    'Enologo_Productor': '/enologo',
    'Encargado_de_Bodega': '/bodeguero',
    'Vendedor': '/vendedor',
};