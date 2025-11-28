import api from "@/lib/apiClient";

const API_ROUTE_URL = "/api/users";

export async function getUsers() {
    return api.get(API_ROUTE_URL);
}

export const getRoles = async () => {
    try {
        return await api.get(API_ROUTE_URL + "/roles");
    } catch (error) {
        console.error("Error al obtener roles:", error);
        return { success: false, errorMessage: "Error al obtener roles" };
    }
};

interface NewUserData {
    name: string;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    role: string;
}

interface UpdateUserData extends Partial<NewUserData> { }

interface RoleApi {
    id_rol: string;
    nombre: string;
    descripcion: string;
}

export async function createUser(userData: NewUserData) {
    const rolesResult = await getRoles();

    if (!rolesResult?.success) {
        return {
            success: false,
            errorMessage: rolesResult?.errorMessage || "Fallo al obtener la lista de roles del backend.",
        };
    }

    const rolesList: RoleApi[] = rolesResult.data as RoleApi[];
    const matchingRole = rolesList.find((role) => role.nombre === userData.role);

    if (!matchingRole) {
        return {
            success: false,
            errorMessage: `Rol no encontrado: El nombre de rol '${userData.role}' no existe en el backend.`,
        };
    }

    userData.role = matchingRole.id_rol;

    const postBody = {
        nombre: userData.name,
        username: userData.username,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        id_rol: userData.role,
        email: userData.email,
    };

    try {
        return await api.post(API_ROUTE_URL, postBody);
    } catch (error) {
        console.error("Error al crear usuario:", error);
        return { success: false, errorMessage: "Error al crear usuario" };
    }
}

export async function updateUser(id: string, userData: UpdateUserData) {
    try {
        return await api.patch(`${API_ROUTE_URL}/${id}`, userData);
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        return { success: false, errorMessage: "Error al actualizar usuario" };
    }
}

export async function deleteUser(id: string) {
    try {
        return await api.del(`${API_ROUTE_URL}/${id}`);
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        return { success: false, errorMessage: "Error al eliminar usuario" };
    }
}