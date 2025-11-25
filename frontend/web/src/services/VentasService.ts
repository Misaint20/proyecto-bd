import { Venta, DetalleVentaItem } from "@/types/ventas";

const API_ROUTE_URL = "/api/ventas";

export async function getVentas() {
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

export interface NewVentaData extends Omit<Venta, "id_venta" | "total"> {}

interface UpdateVentaData extends Partial<NewVentaData> { }

export async function createVenta(data: NewVentaData) {
    try {
        const body = {
            ...data,
        }
        const response = await fetch(API_ROUTE_URL, {
            method: "POST",
            body: JSON.stringify(body),
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
        const response = await fetch(`/api/ventas/${id}`, {
            method: "PATCH",
            body: JSON.stringify(body),
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
        console.error("Error al actualizar venta:", error);
        return {
            success: false,
            errorMessage: "Error al actualizar venta"
        }
    }
}

export async function deleteVenta(id: string) {
    try {
        const response = await fetch(`/api/ventas/${id}`, {
            method: "DELETE"
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
        console.error("Error al eliminar venta:", error);
        return {
            success: false,
            errorMessage: "Error al eliminar venta"
        }
    }
}