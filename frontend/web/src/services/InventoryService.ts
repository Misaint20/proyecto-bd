import { Inventario } from "@/types/inventory";
import api from "@/lib/apiClient";

const API_ROUTE_URL = "/api/inventario";

export async function getInventario() {
    try {
        return await api.get(API_ROUTE_URL);
    } catch (error) {
        console.error("Error al obtener inventario:", error);
        return { success: false, errorMessage: "Error al obtener inventario" };
    }
}

interface NewInventarioData extends Omit<Inventario, "id_inventario" | "Lote"> { }

interface UpdateInventarioData extends Partial<Inventario> { }

export async function createInventario(data: NewInventarioData) {
    try {
        return await api.post(API_ROUTE_URL, data);
    } catch (error) {
        console.error("Error al crear inventario:", error);
        return { success: false, errorMessage: "Error al crear inventario" };
    }
}

export const updateInventario = async (id: string, data: UpdateInventarioData) => {
    try {
        return await api.patch(`${API_ROUTE_URL}/${id}`, data);
    } catch (error) {
        console.error("Error al actualizar inventario:", error);
        return { success: false, errorMessage: "Error al actualizar inventario" };
    }
}

export const deleteInventario = async (id: string) => {
    try {
        return await api.del(`${API_ROUTE_URL}/${id}`);
    } catch (error) {
        console.error("Error al eliminar inventario:", error);
        return { success: false, errorMessage: "Error al eliminar inventario" };
    }
}