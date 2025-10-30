const API_ROUTE_URL = "/api/vinos";

export async function getVinos() {
    try {
        const response = await fetch(API_ROUTE_URL, {
            method: "GET",
        })
        if (response.ok) {
            const result = await response.json()
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
        console.error("Error al cargar vinos:", error)
        return {
            success: false,
            errorMessage: "Error al cargar vinos"
        }
    }
}

export async function createVino(vinoData: any) {
    try {
        const response = await fetch(API_ROUTE_URL, {
            method: "POST",
            body: JSON.stringify(vinoData),
        })
        if (response.ok) {
            const result = await response.json()
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
        console.error("Error al crear vino:", error)
        return {
            success: false,
            errorMessage: "Error al crear vino"
        }
    }
}

export async function updateVino(id_vino: string, vinoData: any) {
    try {
        const response = await fetch(`${API_ROUTE_URL}/${id_vino}`, {
            method: "PATCH",
            body: JSON.stringify(vinoData),
        })
        if (response.ok) {
            const result = await response.json()
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
        console.error("Error al actualizar vino:", error)
        return {
            success: false,
            errorMessage: "Error al actualizar vino"
        }
    }
}

export async function deleteVino(id_vino: string) {
    try {
        const response = await fetch(`${API_ROUTE_URL}/${id_vino}`, {
            method: "DELETE",
        })
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
        console.error("Error al eliminar vino:", error)
        return {
            success: false,
            errorMessage: "Error al eliminar vino"
        }
    }
}