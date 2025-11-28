import { Venta, DetalleVentaItem } from "@/types/ventas";
import api from "@/lib/apiClient";

const API_ROUTE_URL = "/api/ventas";

export async function getVentas() {
    try {
        return await api.get(API_ROUTE_URL);
    } catch (error) {
        console.error("Error al obtener ventas:", error);
        return { success: false, errorMessage: "Error al obtener ventas" };
    }
}

export interface NewVentaData extends Omit<Venta, "id_venta" | "total"> {}

interface UpdateVentaData extends Partial<NewVentaData> { }

export async function createVenta(data: NewVentaData) {
    try {
        const body = {
            ...data,
        }
        return await api.post(API_ROUTE_URL, body);
    } catch (error) {
        console.error("Error al crear venta:", error);
        return {
            success: false,
            errorMessage: "Error al crear venta"
        }
    }
}

export async function updateVenta(id: string, data: UpdateVentaData) {
    try {
        const body = {
            ...data,
            Detalle_Venta: data.detalles?.map((detalle: DetalleVentaItem) => {
                return {
                    id_vino: detalle.id_vino,
                    id_lote: detalle.id_lote,
                    cantidad: detalle.cantidad
                }
            }), 
            fecha_venta: data.fecha_venta ? new Date(data.fecha_venta).toISOString() : null,
        }
        return await api.patch(`/api/ventas/${id}`, body);
    } catch (error) {
        console.error("Error al actualizar venta:", error);
        return {
            success: false,
            errorMessage: "Error al actualizar venta"
        }
    }
}

export async function deleteVenta(id: string) {
    try {
        return await api.del(`/api/ventas/${id}`);
    } catch (error) {
        console.error("Error al eliminar venta:", error);
        return {
            success: false,
            errorMessage: "Error al eliminar venta"
        }
    }
}