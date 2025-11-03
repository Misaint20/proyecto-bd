import { Lote } from "@/types/traceability";

export async function getLotes() {
    try {
        const response = await fetch("/api/traceability/lotes", {
            method: "GET",
        });
        if (response.ok) {
            const result = await response.json();
            return {
                success: true,
                data: result.data || result
            }
        } else if (response.status === 401) {
            return {
                success: false,
                errorMessage: "No tienes permisos para acceder a este recurso"
            }
        }
    } catch (error) {
        console.error("Error al obtener lotes:", error);
        return {
            success: false,
            errorMessage: "Error al obtener lotes"
        }
    }
}