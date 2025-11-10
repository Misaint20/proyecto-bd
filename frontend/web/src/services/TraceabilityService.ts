import { Lote, ControlCalidad, ProcesoProduccion, Cosecha } from "@/types/traceability";

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

        const response = await fetch("/api/traceability/lotes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
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
        console.error("Error al crear lote:", error);
        return {
            success: false,
            errorMessage: "Error al crear lote"
        }
    }
}

export async function updateLote(id: string, loteData: UpdateLoteData) {
    try {
        const body = {
            ...loteData,
            fecha_embotellado: loteData.fecha_embotellado ? new Date(loteData.fecha_embotellado).toISOString() : null,
        }
        const response = await fetch(`/api/traceability/lotes/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
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
        console.error("Error al actualizar lote:", error);
        return {
            success: false,
            errorMessage: "Error al actualizar lote"
        }
    }
}

export async function deleteLote(id: string) {
    try {
        const response = await fetch(`/api/traceability/lotes/${id}`, {
            method: "DELETE"
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
        console.error("Error al eliminar lote:", error);
        return {
            success: false,
            errorMessage: "Error al eliminar lote"
        }
    }
}

interface NewCosechaData extends Omit<Cosecha, "id_cosecha" | "Vinedo"> {
    id_vinedo: string;
}

interface UpdateCosechaData extends Partial<NewCosechaData> { }

export async function getCosechas() {
    try {
        const response = await fetch("/api/traceability/cosecha", {
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
        console.error("Error al obtener cosechas:", error);
        return {
            success: false,
            errorMessage: "Error al obtener cosechas"
        }
    }
}

export async function createCosecha(cosechaData: NewCosechaData) {
    try {
        const body = {
            ...cosechaData,
            fecha_cosecha: cosechaData.fecha_cosecha ? new Date(cosechaData.fecha_cosecha).toISOString() : null,
        }
        const response = await fetch("/api/traceability/cosecha", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
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
        console.error("Error al crear cosecha:", error);
        return {
            success: false,
            errorMessage: "Error al crear cosecha"
        }
    }
}

export async function updateCosecha(id: string, cosechaData: UpdateCosechaData) {
    try {
        const response = await fetch(`/api/traceability/cosecha/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cosechaData)
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
        console.error("Error al actualizar cosecha:", error);
        return {
            success: false,
            errorMessage: "Error al actualizar cosecha"
        }
    }
}

export async function deleteCosecha(id: string) {
    try {
        const response = await fetch(`/api/traceability/cosecha/${id}`, {
            method: "DELETE"
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
        console.error("Error al eliminar cosecha:", error);
        return {
            success: false,
            errorMessage: "Error al eliminar cosecha"
        }
    }
}

export async function getControlCalidad() {
    try {
        const response = await fetch("/api/traceability/calidad", {
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
        console.error("Error al obtener controles de calidad:", error);
        return {
            success: false,
            errorMessage: "Error al obtener controles de calidad"
        }
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
        const response = await fetch("/api/traceability/calidad", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
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
        console.error("Error al crear control de calidad:", error);
        return {
            success: false,
            errorMessage: "Error al crear control de calidad"
        }
    }
}

export async function updateControlCalidad(id: string, controlCalidadData: UpdateControlCalidadData) {
    try {
        const body = {
            ...controlCalidadData,
            fecha_analisis: controlCalidadData.fecha_analisis ? new Date(controlCalidadData.fecha_analisis).toISOString() : null,
        }
        const response = await fetch(`/api/traceability/calidad/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
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
        console.error("Error al actualizar control de calidad:", error);
        return {
            success: false,
            errorMessage: "Error al actualizar control de calidad"
        }
    }
}

export async function deleteControlCalidad(id: string) {
    try {
        const response = await fetch(`/api/traceability/calidad/${id}`, {
            method: "DELETE"
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
        console.error("Error al eliminar control de calidad:", error);
        return {
            success: false,
            errorMessage: "Error al eliminar control de calidad"
        }
    }
}

export async function getProcesosProduccion() {
    try {
        const response = await fetch("/api/traceability/procesos", {
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
        console.error("Error al obtener procesos de producción:", error);
        return {
            success: false,
            errorMessage: "Error al obtener procesos de producción"
        }
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
        const response = await fetch("/api/traceability/procesos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
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
        console.error("Error al obtener procesos:", error);
        return {
            success: false,
            errorMessage: "Error al obtener procesos"
        }
    }
}


export async function updateProcesoProduccion(id: string, procesoProduccionData: UpdateProcesoProduccionData) {
    try {
        const body = {
            ...procesoProduccionData,
            fecha_inicio: procesoProduccionData.fecha_inicio ? new Date(procesoProduccionData.fecha_inicio).toISOString() : null,
            fecha_fin: procesoProduccionData.fecha_fin ? new Date(procesoProduccionData.fecha_fin).toISOString() : null,
        }
        const response = await fetch(`/api/traceability/procesos/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
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
        console.error("Error al actualizar proceso:", error);
        return {
            success: false,
            errorMessage: "Error al actualizar proceso"
        }
    }
}

export async function deleteProcesoProduccion(id: string) {
    try {
        const response = await fetch(`/api/traceability/procesos/${id}`, {
            method: "DELETE"
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
        console.error("Error al eliminar proceso:", error);
        return {
            success: false,
            errorMessage: "Error al eliminar proceso"
        }
    }
}