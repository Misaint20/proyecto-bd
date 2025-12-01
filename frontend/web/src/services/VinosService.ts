import api from "@/lib/apiClient";

const API_ROUTE_URL = "/api/vinos";

export async function getVinos() {
    try {
        return await api.get(API_ROUTE_URL);
    } catch (error) {
        console.error("Error al cargar vinos:", error);
        return { success: false, errorMessage: "Error al cargar vinos" };
    }
}

export async function createVino(vinoData: any) {
    try {
        return await api.post(API_ROUTE_URL, vinoData);
    } catch (error) {
        console.error("Error al crear vino:", error);
        return { success: false, errorMessage: "Error al crear vino" };
    }
}

export async function updateVino(id_vino: string, vinoData: any) {
    try {
        return await api.patch(`${API_ROUTE_URL}/${id_vino}`, vinoData);
    } catch (error) {
        console.error("Error al actualizar vino:", error);
        return { success: false, errorMessage: "Error al actualizar vino" };
    }
}

export async function deleteVino(id_vino: string) {
    try {
        return await api.del(`${API_ROUTE_URL}/${id_vino}`);
    } catch (error) {
        console.error("Error al eliminar vino:", error);
        return { success: false, errorMessage: "Error al eliminar vino" };
    }
}