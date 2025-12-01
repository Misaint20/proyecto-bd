import { Vinedo, Varietal, Barrica, MezclaVino } from "@/types/masters";
import api from "@/lib/apiClient";

const API_ROUTE_URL = "/api/maestros";

export async function getVinedos() {
    try {
        return await api.get(API_ROUTE_URL + "/vinedos");
    } catch (error) {
        console.error("Error al obtener vinedos:", error);
        return { success: false, errorMessage: "Error al obtener vinedos" };
    }
}

interface NewVinedoData extends Omit<Vinedo, "id_vinedo"> {
}

interface UpdateVinedoData extends Partial<Vinedo> { }

/**
 * Crea un nuevo vinedo.
 * @param data Datos del vinedo a crear.
 * @returns La respuesta del servidor.
 */
export async function createVinedo(data: NewVinedoData) {
    try {
        return await api.post(API_ROUTE_URL + "/vinedos", data);
    } catch (error) {
        console.error("Error al crear vinedo:", error);
        return { success: false, errorMessage: "Error al crear vinedo" };
    }
}

export const updateVinedo = async (id: string, data: UpdateVinedoData) => {
    try {
        return await api.patch(`${API_ROUTE_URL}/vinedos/${id}`, data);
    } catch (error) {
        console.error("Error al actualizar vinedo:", error);
        return { success: false, errorMessage: "Error al actualizar vinedo" };
    }
}

export const deleteVinedo = async (id: string) => {
    try {
        return await api.del(`${API_ROUTE_URL}/vinedos/${id}`);
    } catch (error) {
        console.error("Error al eliminar vinedo:", error);
        return { success: false, errorMessage: "Error al eliminar vinedo" };
    }
}

export const getVarietales = async () => {
    try {
        return await api.get(API_ROUTE_URL + "/varietales");
    } catch (error) {
        console.error("Error al obtener varietales:", error);
        return { success: false, errorMessage: "Error al obtener varietales" };
    }
}

interface NewVarietalData extends Omit<Varietal, "id_varietal"> { }

interface UpdateVarietalData extends Partial<Varietal> { }

/**
 * Crea un nuevo varietal.
 * @param data Datos del varietal a crear.
 * @returns La respuesta del servidor.
 */
export async function createVarietal(data: NewVarietalData) {
    try {
        return await api.post(API_ROUTE_URL + "/varietales", data);
    } catch (error) {
        console.error("Error al crear varietal:", error);
        return { success: false, errorMessage: "Error al crear varietal" };
    }
}

export const updateVarietal = async (id: string, data: UpdateVarietalData) => {
    try {
        return await api.patch(`${API_ROUTE_URL}/varietales/${id}`, data);
    } catch (error) {
        console.error("Error al actualizar varietal:", error);
        return { success: false, errorMessage: "Error al actualizar varietal" };
    }
}

export const deleteVarietal = async (id: string) => {
    try {
        return await api.del(`${API_ROUTE_URL}/varietales/${id}`);
    } catch (error) {
        console.error("Error al eliminar varietal:", error);
        return { success: false, errorMessage: "Error al eliminar varietal" };
    }
}

export const getBarricas = async () => {
    try {
        return await api.get(API_ROUTE_URL + "/barricas");
    } catch (error) {
        console.error("Error al obtener barricas:", error);
        return { success: false, errorMessage: "Error al obtener barricas" };
    }
}

interface NewBarricaData extends Omit<Barrica, "id_barrica"> { }

interface UpdateBarricaData extends Partial<Barrica> { }

/**
 * Crea un nuevo barrica.
 * @param data Datos de la barrica a crear.
 * @returns La respuesta del servidor.
 */
export async function createBarrica(data: NewBarricaData) {
    try {
        const body = {
            ...data,
            fecha_compra: data.fecha_compra ? new Date(data.fecha_compra).toISOString() : null,
        }
        return await api.post(API_ROUTE_URL + "/barricas", body);
    } catch (error) {
        console.error("Error al crear barrica:", error);
        return { success: false, errorMessage: "Error al crear barrica" };
    }
}

export const updateBarrica = async (id: string, data: UpdateBarricaData) => {
    try {
        return await api.patch(`${API_ROUTE_URL}/barricas/${id}`, data);
    } catch (error) {
        console.error("Error al actualizar barrica:", error);
        return { success: false, errorMessage: "Error al actualizar barrica" };
    }
}

export const deleteBarrica = async (id: string) => {
    try {
        return await api.del(`${API_ROUTE_URL}/barricas/${id}`);
    } catch (error) {
        console.error("Error al eliminar barrica:", error);
        return { success: false, errorMessage: "Error al eliminar barrica" };
    }
}

export const getMezclasVino = async () => {
    try {
        return await api.get(API_ROUTE_URL + "/mezclas");
    } catch (error) {
        console.error("Error al obtener mezclas vino:", error);
        return { success: false, errorMessage: "Error al obtener mezclas vino" };
    }
}

interface NewMezclaVinoData extends Omit<MezclaVino, "id_mezcla" | "Vino" | "Varietal"> { }

interface UpdateMezclaVinoData extends Partial<MezclaVino> { }

/**
 * Crea una nueva mezcla de vino.
 * @param data Datos de la mezcla de vino a crear.
 * @returns La respuesta del servidor.
 */
export async function createMezclaVino(data: NewMezclaVinoData) {
    try {
        return await api.post(API_ROUTE_URL + "/mezclas", data);
    } catch (error) {
        console.error("Error al crear mezcla de vino:", error);
        return { success: false, errorMessage: "Error al crear mezcla de vino" };
    }
}

export const updateMezclaVino = async (id: string, data: UpdateMezclaVinoData) => {
    try {
        return await api.patch(`${API_ROUTE_URL}/mezclas/${id}`, data);
    } catch (error) {
        console.error("Error al actualizar mezcla de vino:", error);
        return { success: false, errorMessage: "Error al actualizar mezcla de vino" };
    }
}

export const deleteMezclaVino = async (id: string) => {
    try {
        return await api.del(`${API_ROUTE_URL}/mezclas/${id}`);
    } catch (error) {
        console.error("Error al eliminar mezcla de vino:", error);
        return { success: false, errorMessage: "Error al eliminar mezcla de vino" };
    }
}