import { Vinedo, Varietal, Barrica, MezclaVino } from "@/types/masters"

const API_ROUTE_URL = "/api/maestros";

export async function getVinedos() {
    try {
        const response = await fetch(API_ROUTE_URL + "/vinedos", {
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
        console.error("Error al obtener vinedos:", error);
        return {
            success: false,
            errorMessage: "Error al obtener vinedos"
        }
    }
}

interface NewVinedoData extends Omit<Vinedo, "id_vinedo"> {
}

interface UpdateVinedoData extends Partial<Vinedo> {}

/**
 * Crea un nuevo vinedo.
 * @param data Datos del vinedo a crear.
 * @returns La respuesta del servidor.
 */
export async function createVinedo(data: NewVinedoData) {
    try {
        const response = await fetch(API_ROUTE_URL + "/vinedos", {
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
        console.error("Error al crear vinedo:", error);
        return {
            success: false,
            errorMessage: "Error al crear vinedo"
        }
    }
}

export const updateVinedo = async (id: string, data: UpdateVinedoData) => {
    try {
        const response = await fetch(`${API_ROUTE_URL}/vinedos/${id}`, {
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
        console.error("Error al actualizar vinedo:", error);
        return {
            success: false,
            errorMessage: "Error al actualizar vinedo"
        }
    }
}

export const deleteVinedo = async (id: string) => {
    try {
        const response = await fetch(`${API_ROUTE_URL}/vinedos/${id}`, {
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
        console.error("Error al eliminar vinedo:", error);
        return {
            success: false,
            errorMessage: "Error al eliminar vinedo"
        }
    }
}

export const getVarietales = async () => {
    try {
        const response = await fetch(API_ROUTE_URL + "/varietales", {
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
        console.error("Error al obtener varietales:", error);
        return {
            success: false,
            errorMessage: "Error al obtener varietales"
        }
    }
}

interface NewVarietalData extends Omit<Varietal, "id_varietal"> {}

interface UpdateVarietalData extends Partial<Varietal> {}

/**
 * Crea un nuevo varietal.
 * @param data Datos del varietal a crear.
 * @returns La respuesta del servidor.
 */
export async function createVarietal(data: NewVarietalData) {
    try {
        const response = await fetch(API_ROUTE_URL + "/varietales", {
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
        console.error("Error al crear varietal:", error);
        return {
            success: false,
            errorMessage: "Error al crear varietal"
        }
    }
}

export const updateVarietal = async (id: string, data: UpdateVarietalData) => {
    try {
        const response = await fetch(`${API_ROUTE_URL}/varietales/${id}`, {
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
        console.error("Error al actualizar varietal:", error);
        return {
            success: false,
            errorMessage: "Error al actualizar varietal"
        }
    }
}

export const deleteVarietal = async (id: string) => {
    try {
        const response = await fetch(`${API_ROUTE_URL}/varietales/${id}`, {
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
        console.error("Error al eliminar varietal:", error);
        return {
            success: false,
            errorMessage: "Error al eliminar varietal"
        }
    }
}

export const getBarricas = async () => {
    try {
        const response = await fetch(API_ROUTE_URL + "/barricas", {
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
        console.error("Error al obtener barricas:", error);
        return {
            success: false,
            errorMessage: "Error al obtener barricas"
        }
    }
}

interface NewBarricaData extends Omit<Barrica, "id_barrica"> {}

interface UpdateBarricaData extends Partial<Barrica> {}

/**
 * Crea un nuevo barrica.
 * @param data Datos de la barrica a crear.
 * @returns La respuesta del servidor.
 */
export async function createBarrica(data: NewBarricaData) {
    try {
        const response = await fetch(API_ROUTE_URL + "/barricas", {
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
        console.error("Error al crear barrica:", error);
        return {
            success: false,
            errorMessage: "Error al crear barrica"
        }
    }
}

export const updateBarrica = async (id: string, data: UpdateBarricaData) => {
    try {
        const response = await fetch(`${API_ROUTE_URL}/barricas/${id}`, {
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
        console.error("Error al actualizar barrica:", error);
        return {
            success: false,
            errorMessage: "Error al actualizar barrica"
        }
    }
}

export const deleteBarrica = async (id: string) => {
    try {
        const response = await fetch(`${API_ROUTE_URL}/barricas/${id}`, {
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
        console.error("Error al eliminar barrica:", error);
        return {
            success: false,
            errorMessage: "Error al eliminar barrica"
        }
    }
}

export const getMezclasVino = async () => {
    try {
        const response = await fetch(API_ROUTE_URL + "/mezclas", {
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
        console.error("Error al obtener mezclas vino:", error);
        return {
            success: false,
            errorMessage: "Error al obtener mezclas vino"
        }
    }
}   

interface NewMezclaVinoData extends Omit<MezclaVino, "id_mezcla" | "Vino" | "Varietal"> {}

interface UpdateMezclaVinoData extends Partial<MezclaVino> {}

/**
 * Crea una nueva mezcla de vino.
 * @param data Datos de la mezcla de vino a crear.
 * @returns La respuesta del servidor.
 */
export async function createMezclaVino(data: NewMezclaVinoData) {
    try {
        const response = await fetch(API_ROUTE_URL + "/mezclas", {
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
        console.error("Error al crear mezcla de vino:", error);
        return {
            success: false,
            errorMessage: "Error al crear mezcla de vino"
        }
    }
}

export const updateMezclaVino = async (id: string, data: UpdateMezclaVinoData) => {
    try {
        const response = await fetch(`${API_ROUTE_URL}/mezclas/${id}`, {
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
        console.error("Error al actualizar mezcla de vino:", error);
        return {
            success: false,
            errorMessage: "Error al actualizar mezcla de vino"
        }
    }
}

export const deleteMezclaVino = async (id: string) => {
    try {
        const response = await fetch(`${API_ROUTE_URL}/mezclas/${id}`, {
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
        console.error("Error al eliminar mezcla de vino:", error);
        return {
            success: false,
            errorMessage: "Error al eliminar mezcla de vino"
        }
    }
}