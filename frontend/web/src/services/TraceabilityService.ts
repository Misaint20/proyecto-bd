import { Lote, ControlCalidad, ProcesoProduccion, Cosecha } from "@/types/traceability";
import api from "@/lib/apiClient";

export async function getLotes() {
    try {
        return await api.get("/api/traceability/lotes");
    } catch (error) {
        console.error("Error al obtener lotes:", error);
        return { success: false, errorMessage: "Error al obtener lotes" };
    }
}

interface NewLoteData extends Omit<Lote, "id_lote" | "Barrica" | "Cosecha" | "Vino"> {
    id_vino: string;
    id_cosecha: string;
    id_barrica?: string | null;
}

interface UpdateLoteData extends Partial<NewLoteData> { }

export async function createLote(loteData: NewLoteData) {
    try {
        const body = {
            ...loteData,
            fecha_embotellado: loteData.fecha_embotellado ? new Date(loteData.fecha_embotellado).toISOString() : null,
        }
        return await api.post("/api/traceability/lotes", body);
    } catch (error) {
        console.error("Error al crear lote:", error);
        return { success: false, errorMessage: "Error al crear lote" };
    }
}

export async function updateLote(id: string, loteData: UpdateLoteData) {
    try {
        const body = {
            ...loteData,
            fecha_embotellado: loteData.fecha_embotellado ? new Date(loteData.fecha_embotellado).toISOString() : null,
        }
        return await api.patch(`/api/traceability/lotes/${id}`, body);
    } catch (error) {
        console.error("Error al actualizar lote:", error);
        return { success: false, errorMessage: "Error al actualizar lote" };
    }
}

export async function deleteLote(id: string) {
    try {
        return await api.del(`/api/traceability/lotes/${id}`);
    } catch (error) {
        console.error("Error al eliminar lote:", error);
        return { success: false, errorMessage: "Error al eliminar lote" };
    }
}

interface NewCosechaData extends Omit<Cosecha, "id_cosecha" | "Vinedo"> {
    id_vinedo: string;
}

interface UpdateCosechaData extends Partial<NewCosechaData> { }

export async function getCosechas() {
    try {
        return await api.get("/api/traceability/cosecha");
    } catch (error) {
        console.error("Error al obtener cosechas:", error);
        return { success: false, errorMessage: "Error al obtener cosechas" };
    }
}

export async function createCosecha(cosechaData: NewCosechaData) {
    try {
        const body = {
            ...cosechaData,
            fecha_cosecha: cosechaData.fecha_cosecha ? new Date(cosechaData.fecha_cosecha).toISOString() : null,
        }
        return await api.post("/api/traceability/cosecha", body);
    } catch (error) {
        console.error("Error al crear cosecha:", error);
        return { success: false, errorMessage: "Error al crear cosecha" };
    }
}

export async function updateCosecha(id: string, cosechaData: UpdateCosechaData) {
    try {
        const body = {
            ...cosechaData,
            fecha_cosecha: cosechaData.fecha_cosecha ? new Date(cosechaData.fecha_cosecha).toISOString() : null,
        }
        return await api.patch(`/api/traceability/cosecha/${id}`, body);
    } catch (error) {
        console.error("Error al actualizar cosecha:", error);
        return { success: false, errorMessage: "Error al actualizar cosecha" };
    }
}

export async function deleteCosecha(id: string) {
    try {
        return await api.del(`/api/traceability/cosecha/${id}`);
    } catch (error) {
        console.error("Error al eliminar cosecha:", error);
        return { success: false, errorMessage: "Error al eliminar cosecha" };
    }
}

export async function getControlCalidad() {
    try {
        return await api.get("/api/traceability/calidad");
    } catch (error) {
        console.error("Error al obtener controles de calidad:", error);
        return { success: false, errorMessage: "Error al obtener controles de calidad" };
    }
}

interface NewControlCalidadData extends Omit<ControlCalidad, "id_control" | "Proceso_Produccion"> {
    id_proceso: string;
}

interface UpdateControlCalidadData extends Partial<ControlCalidad> { }

export async function createControlCalidad(controlCalidadData: NewControlCalidadData) {
    try {
        const body = {
            ...controlCalidadData,
            fecha_analisis: controlCalidadData.fecha_analisis ? new Date(controlCalidadData.fecha_analisis).toISOString() : null,
        }
        return await api.post("/api/traceability/calidad", body);
    } catch (error) {
        console.error("Error al crear control de calidad:", error);
        return { success: false, errorMessage: "Error al crear control de calidad" };
    }
}

export async function updateControlCalidad(id: string, controlCalidadData: UpdateControlCalidadData) {
    try {
        const body = {
            ...controlCalidadData,
            fecha_analisis: controlCalidadData.fecha_analisis ? new Date(controlCalidadData.fecha_analisis).toISOString() : null,
        }
        return await api.patch(`/api/traceability/calidad/${id}`, body);
    } catch (error) {
        console.error("Error al actualizar control de calidad:", error);
        return { success: false, errorMessage: "Error al actualizar control de calidad" };
    }
}

export async function deleteControlCalidad(id: string) {
    try {
        return await api.del(`/api/traceability/calidad/${id}`);
    } catch (error) {
        console.error("Error al eliminar control de calidad:", error);
        return { success: false, errorMessage: "Error al eliminar control de calidad" };
    }
}

export async function getProcesosProduccion() {
    try {
        return await api.get("/api/traceability/procesos");
    } catch (error) {
        console.error("Error al obtener procesos de producción:", error);
        return { success: false, errorMessage: "Error al obtener procesos de producción" };
    }
}

interface NewProcesoProduccionData extends Omit<ProcesoProduccion, "id_proceso" | "Lote"> {
    id_lote: string;
}

interface UpdateProcesoProduccionData extends Partial<ProcesoProduccion> { }

export async function createProcesoProduccion(procesoProduccionData: NewProcesoProduccionData) {
    try {
        const body = {
            ...procesoProduccionData,
            fecha_inicio: procesoProduccionData.fecha_inicio ? new Date(procesoProduccionData.fecha_inicio).toISOString() : null,
            fecha_fin: procesoProduccionData.fecha_fin ? new Date(procesoProduccionData.fecha_fin).toISOString() : null,
        }
        return await api.post("/api/traceability/procesos", body);
    } catch (error) {
        console.error("Error al obtener procesos:", error);
        return { success: false, errorMessage: "Error al obtener procesos" };
    }
}


export async function updateProcesoProduccion(id: string, procesoProduccionData: UpdateProcesoProduccionData) {
    try {
        const body = {
            ...procesoProduccionData,
            fecha_inicio: procesoProduccionData.fecha_inicio ? new Date(procesoProduccionData.fecha_inicio).toISOString() : null,
            fecha_fin: procesoProduccionData.fecha_fin ? new Date(procesoProduccionData.fecha_fin).toISOString() : null,
        }
        return await api.patch(`/api/traceability/procesos/${id}`, body);
    } catch (error) {
        console.error("Error al actualizar proceso:", error);
        return { success: false, errorMessage: "Error al actualizar proceso" };
    }
}

export async function deleteProcesoProduccion(id: string) {
    try {
        return await api.del(`/api/traceability/procesos/${id}`);
    } catch (error) {
        console.error("Error al eliminar proceso:", error);
        return { success: false, errorMessage: "Error al eliminar proceso" };
    }
}