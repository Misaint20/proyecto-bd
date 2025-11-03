import { Inventario } from "@/types/inventory"

const API_ROUTE_URL = "/api/inventario";

export async function getInventario() {
    try {
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
    } catch (error) {
        console.error("Error al obtener inventario:", error);
        return {
            success: false,
            errorMessage: "Error al obtener inventario"
        }
    }
}

interface NewInventarioData extends Omit<Inventario, "id_inventario" | "Lote"> {}

interface UpdateInventarioData extends Partial<Inventario> {}

/**
 * Crea un nuevo inventario.
 * @param data Datos del inventario a crear.
 * @returns La respuesta del servidor.
 */
export async function createInventario(data: NewInventarioData) {
    try {
        const response = await fetch(API_ROUTE_URL, {
            method: "POST",
            body: JSON.stringify(data),
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
        console.error("Error al crear inventario:", error);
        return {
            success: false,
            errorMessage: "Error al crear inventario"
        }
    }
}

export const updateInventario = async (id: string, data: UpdateInventarioData) => {
    try {
        const response = await fetch(`${API_ROUTE_URL}/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
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
        console.error("Error al actualizar inventario:", error);
        return {
            success: false,
            errorMessage: "Error al actualizar inventario"
        }
    }
}

export const deleteInventario = async (id: string) => {
    try {
        const response = await fetch(`${API_ROUTE_URL}/${id}`, {
            method: "DELETE",
        });
        if (response.ok) {
            return {
                success: true,
                data: null
            }
        } else if (response.status === 401) {
            return {
                success: false,
                errorMessage: "No tienes permisos para acceder a este recurso"
            }
        }
    } catch (error) {
        console.error("Error al eliminar inventario:", error);
        return {
            success: false,
            errorMessage: "Error al eliminar inventario"
        }
    }
}