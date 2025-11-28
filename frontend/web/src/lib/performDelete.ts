"use client"

import { confirm } from "@/lib/confirm"

export async function performDelete(
    deleter: (id: string) => Promise<any>,
    id: string,
    onSuccess?: () => void,
    options?: { confirmMessage?: string }
) {
    const confirmMessage = options?.confirmMessage ?? "¿Estás seguro de que quieres eliminar este registro?"

    const ok = await confirm({ description: confirmMessage })
    if (!ok) return { success: false, errorMessage: "cancelled" }

    try {
        const result = await deleter(id)
        if (result && result.success) {
            if (onSuccess) onSuccess()
            return result
        }

        console.error("Error al eliminar:", result?.errorMessage)
        return result
    } catch (error) {
        console.error("Error inesperado al eliminar:", error)
        return { success: false, errorMessage: "Error en la operación de eliminación" }
    }
}

export default performDelete;
