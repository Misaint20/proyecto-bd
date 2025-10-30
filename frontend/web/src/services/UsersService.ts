const API_ROUTE_URL = "/api/users";

export async function getUsers() {
    const response = await fetch(API_ROUTE_URL, {
        method: "GET",
    });
    if (response.ok) {
        const data = await response.json();
        return {
            success: true,
            data: data
        }
    } else if (response.status === 401) {
        return {
            success: false,
            errorMessage: "No tienes permisos para acceder a este recurso"
        }
    }
}

export const getRoles = async () => {
    try {
        const response = await fetch(API_ROUTE_URL + "/roles", {
            method: "GET",
        });
        if (response.ok) {
            const data = await response.json();
            return {
                success: true,
                data: data
            }
        } else if (response.status === 401) {
            return {
                success: false,
                errorMessage: "No tienes permisos para acceder a este recurso"
            }
        }
    } catch (error) {
        console.error("Error al obtener roles:", error);
        return {
            success: false,
            errorMessage: "Error al obtener roles"
        }
    }
}

interface NewUserData {
    name: string;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    role: string;
}

interface RoleApi {
    id_rol: string;
    nombre: string;
    descripcion: string;
}

export async function createUser(userData: NewUserData) {

    const rolesResult = await getRoles();

    if (!rolesResult?.success) {
        // Si falla la obtención de roles, detenemos el proceso
        return {
            success: false,
            errorMessage: rolesResult?.errorMessage || "Fallo al obtener la lista de roles del backend."
        }
    }

    const rolesList: RoleApi[] = rolesResult.data;

    // 2. BUSCAR EL ID DEL ROL POR SU NOMBRE
    // La comparación debe ser estricta para asegurar que el nombre coincida exactamente con el de la API
    const matchingRole = rolesList.find(
        (role) => role.nombre === userData.role
    );

    if (!matchingRole) {
        return {
            success: false,
            errorMessage: `Rol no encontrado: El nombre de rol '${userData.role}' no existe en el backend.`
        }
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
        const response = await fetch(API_ROUTE_URL, {
            method: "POST",
            body: JSON.stringify(postBody),
        });
        if (response.ok) {
            const data = await response.json();
            return {
                success: true,
                data: data
            }
        } else if (response.status === 401) {
            return {
                success: false,
                errorMessage: "No tienes permisos para acceder a este recurso"
            }
        }
    } catch (error) {
        console.error("Error al crear usuario:", error);
        return {
            success: false,
            errorMessage: "Error al crear usuario"
        }
    }
}