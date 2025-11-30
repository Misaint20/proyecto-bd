import api from "@/lib/apiClient";

const API_ROUTE_URL = "/api/ventas";

export async function getVentaDetail(id: string) {
    try {
        return await api.get(`${API_ROUTE_URL}/${id}`);
    } catch (error) {
        console.error("Error al obtener detalle de venta:", error);
        return {
            success: false,
            errorMessage: "Error al obtener detalle de venta"
        }
    }
}
