import prisma from '../lib/PrismaService';
import { Cosecha, Vinedo, Lote, Control_Calidad, Proceso_Produccion } from '../generated/prisma/client';
import { CosechaCreationData, CosechaUpdateData, LoteCreationData, LoteUpdateData, ProcesoProduccionCreationData, ProcesoProduccionUpdateData, ControlCalidadCreationData, ControlCalidadUpdateData } from '../types/trazabilidad';
import { generateUuid } from '../lib/IdGenerator';
import { Prisma } from '../generated/prisma/client';
import { logger } from '../utils/logger';

// ----------------------------------------
// SERVICIOS PARA COSECHA
// ----------------------------------------

/**
 * Registra una nueva cosecha (entrada de uva), vinculándola a un viñedo.
 * Actor: Enólogo/Productor (RF02)
 */
export const createCosecha = async (data: CosechaCreationData): Promise<Cosecha> => {
    const newId = generateUuid();

    // Extracción del año de la cosecha para el campo 'anio'
    const anio = new Date(data.fecha_cosecha).getFullYear();

    try {
        // Validación: Asegurar que el Viñedo existe (P2003)
        await prisma.vinedo.findUniqueOrThrow({
            where: { id_vinedo: data.id_vinedo }
        });

        return await prisma.cosecha.create({
            data: {
                id_cosecha: newId,
                id_vinedo: data.id_vinedo,
                anio: anio, // Se deduce de la fecha
                cantidad_kg: data.cantidad_kg,
                fecha_cosecha: data.fecha_cosecha,
            },
            include: { Vinedo: true }
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new Error('El Viñedo de origen no fue encontrado.');
        }
        logger.error('Error al crear Cosecha.', { context: 'TrazabilidadService', error });
        throw error;
    }
};

/**
 * Obtiene todas las cosechas, incluyendo el viñedo de origen.
 */
export const findAllCosechas = async (): Promise<Cosecha[]> => {
    return prisma.cosecha.findMany({
        include: { Vinedo: true }
    });
};

/**
 * Actualiza parcialmente una cosecha.
 */
export const updateCosecha = async (id: string, data: CosechaUpdateData): Promise<Cosecha> => {
    try {
        return await prisma.cosecha.update({
            where: { id_cosecha: id },
            data: data as any,
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new Error('Cosecha no encontrada para actualizar.');
        }
        throw error;
    }
};

/**
 * Elimina una cosecha.
 */
export const deleteCosecha = async (id: string): Promise<Cosecha> => {
    try {
        return await prisma.cosecha.delete({
            where: { id_cosecha: id },
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new Error('Cosecha no encontrada para eliminar.');
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
            throw new Error('No se puede eliminar la cosecha porque está asociada a un Lote de Producción.');
        }
        throw error;
    }
};

// ----------------------------------------
// SERVICIOS PARA LOTE (Registro productivo - RF02)
// ----------------------------------------

/**
 * Registra un nuevo Lote de embotellado, vinculando la Cosecha y el Vino final.
 * Actor: Enólogo/Productor (RF02)
 */
export const createLote = async (data: LoteCreationData): Promise<Lote> => {
    const newId = generateUuid();

    // Verificaciones de integridad referencial antes de crear el Lote
    try {
        await prisma.vino.findUniqueOrThrow({ where: { id_vino: data.id_vino } });
        await prisma.cosecha.findUniqueOrThrow({ where: { id_cosecha: data.id_cosecha } });

        if (data.id_barrica) {
            await prisma.barrica.findUniqueOrThrow({ where: { id_barrica: data.id_barrica } });
        }
    } catch (e) {
        logger.warn('Error de integridad al crear Lote: Claves foráneas inexistentes.', { context: 'TrazabilidadService', data });
        throw new Error('Verifique que el Vino, la Cosecha y/o la Barrica existan.');
    }

    try {
        return await prisma.lote.create({
            data: {
                id_lote: newId,
                id_vino: data.id_vino,
                id_cosecha: data.id_cosecha,
                id_barrica: data.id_barrica,
                fecha_embotellado: data.fecha_embotellado,
                cantidad_botellas: data.cantidad_botellas || 0,
                numero_lote: data.numero_lote,
            },
            include: { Vino: true, Cosecha: true },
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            throw new Error(`El número de lote '${data.numero_lote}' ya existe.`);
        }
        logger.error('Error al crear Lote.', { context: 'TrazabilidadService', error });
        throw error;
    }
};

/**
 * Actualiza parcialmente un Lote (PATCH).
 * Permite cambiar la barrica, la cantidad de botellas, etc.
 */
export const updateLote = async (id: string, data: LoteUpdateData): Promise<Lote> => {

    // Verificación de integridad: Si se intenta cambiar la barrica, verificar que exista
    if (data.id_barrica) {
        try {
            await prisma.barrica.findUniqueOrThrow({ where: { id_barrica: data.id_barrica } });
        } catch (e) {
            throw new Error('La Barrica proporcionada para la actualización no existe.');
        }
    }

    try {
        return await prisma.lote.update({
            where: { id_lote: id },
            data: data as any, // Actualización parcial
            include: { Vino: true, Cosecha: true, Barrica: true },
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new Error('Lote no encontrado para actualizar.');
        }
        // Si el número de lote se cambia y ya existe (P2002)
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            throw new Error('El número de lote ya está en uso.');
        }
        logger.error('Error al actualizar Lote.', { context: 'TrazabilidadService', error });
        throw error;
    }
};

/**
 * Obtiene todos los lotes con sus relaciones de Vino y Cosecha.
 */
export const findAllLotes = async (): Promise<Lote[]> => {
    const lotes = await prisma.lote.findMany({
        include: { Vino: true, Cosecha: { include: { Vinedo: true } }, Barrica: true },
    });

    // Agregamos un campo calculado 'meses_en_barrica' cuando el lote tiene una barrica asociada
    const now = new Date();
    const computeMonths = (date?: Date | string | null) => {
        if (!date) return 0;
        const d = new Date(date);
        const months = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
        return months > 0 ? months : 0;
    };

    // Nota: no persistimos estos valores a la DB, solo se devuelven en la respuesta del servicio
    return lotes.map(l => ({
        ...l,
        // Si no tiene barrica, meses_en_barrica = 0
        meses_en_barrica: l.id_barrica ? computeMonths((l as any).fecha_embotellado) : 0,
    } as any));
};

/**
 * Elimina un Lote.
 */
export const deleteLote = async (id: string): Promise<Lote> => {
    try {
        return await prisma.lote.delete({
            where: { id_lote: id },
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new Error('Lote no encontrado para eliminar.');
        }
        // Si el lote ya tiene Inventario o Procesos de Producción asociados.
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
            throw new Error('No se puede eliminar el lote porque ya tiene movimientos de inventario o procesos registrados.');
        }
        throw error;
    }
};

// ----------------------------------------
// SERVICIOS PARA PROCESO DE PRODUCCIÓN (RF02)
// ----------------------------------------

/**
 * Registra un nuevo evento en la cadena de producción (fermentación, crianza, etc.).
 * Actor: Enólogo/Productor (RF02)
 */
export const createProcesoProduccion = async (data: ProcesoProduccionCreationData): Promise<Proceso_Produccion> => {
    const newId = generateUuid();

    try {
        // 1. Verificar integridad: Lote debe existir
        await prisma.lote.findUniqueOrThrow({ where: { id_lote: data.id_lote } });

        // 2. Verificar Barrica si es proporcionada
        if (data.id_barrica) {
            await prisma.barrica.findUniqueOrThrow({ where: { id_barrica: data.id_barrica } });
        }

        return await prisma.proceso_Produccion.create({
            data: {
                id_proceso: newId,
                ...data,
            },
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new Error('El Lote o la Barrica de referencia no existen.');
        }
        logger.error('Error al crear Proceso de Producción.', { context: 'TrazabilidadService', error });
        throw error;
    }
};

/**
 * Obtiene todos los procesos de producción, incluyendo el Lote y la Barrica.
 */
export const findAllProcesosProduccion = async (): Promise<Proceso_Produccion[]> => {
    return prisma.proceso_Produccion.findMany({
        include: { Lote: true, Barrica: true },
    });
};

/**
 * Finaliza o actualiza un proceso de producción (ej. fecha_fin).
 */
export const updateProcesoProduccion = async (id: string, data: ProcesoProduccionUpdateData): Promise<Proceso_Produccion> => {
    try {
        // Nota: No permitimos cambiar id_lote, solo id_barrica, fecha_fin, etc.
        return await prisma.proceso_Produccion.update({
            where: { id_proceso: id },
            data: data as any,
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new Error('Proceso de Producción no encontrado para actualizar.');
        }
        throw error;
    }
};

/**
 * Elimina un Proceso de Producción.
 * Solo si no tiene Controles de Calidad asociados (integridad).
 */
export const deleteProcesoProduccion = async (id: string): Promise<Proceso_Produccion> => {
    try {
        return await prisma.proceso_Produccion.delete({
            where: { id_proceso: id },
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new Error('Proceso de Producción no encontrado para eliminar.');
        }
        // Si tiene registros de Control de Calidad asociados (P2003)
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
            throw new Error('No se puede eliminar el proceso porque tiene registros de Control de Calidad asociados.');
        }
        throw error;
    }
};

// ----------------------------------------
// SERVICIOS PARA CONTROL DE CALIDAD (RF02)
// ----------------------------------------

/**
 * Registra un análisis o cata, vinculándolo a un proceso específico.
 * Actor: Enólogo/Productor (RF02)
 */
export const createControlCalidad = async (data: ControlCalidadCreationData): Promise<Control_Calidad> => {
    const newId = generateUuid();

    try {
        // 1. Verificar integridad: Proceso debe existir
        await prisma.proceso_Produccion.findUniqueOrThrow({ where: { id_proceso: data.id_proceso } });

        return await prisma.control_Calidad.create({
            data: {
                id_control: newId,
                ...data,
            },
            include: { Proceso_Produccion: true }
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new Error('El Proceso de Producción de referencia no existe.');
        }
        logger.error('Error al crear Control de Calidad.', { context: 'TrazabilidadService', error });
        throw error;
    }
};

/**
 * Obtiene todos los registros de control de calidad.
 */
export const findAllControlesCalidad = async (): Promise<Control_Calidad[]> => {
    return prisma.control_Calidad.findMany({
        include: { Proceso_Produccion: true },
    });
};

/**
 * Actualiza parcialmente un Control de Calidad (si está permitido).
 */
export const updateControlCalidad = async (id: string, data: ControlCalidadUpdateData): Promise<Control_Calidad> => {
    try {
        return await prisma.control_Calidad.update({
            where: { id_control: id },
            data: data as any,
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new Error('Control de Calidad no encontrado para actualizar.');
        }
        throw error;
    }
};

/**
 * Elimina un Control de Calidad.
 */
export const deleteControlCalidad = async (id: string): Promise<Control_Calidad> => {
    try {
        return await prisma.control_Calidad.delete({
            where: { id_control: id },
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new Error('Control de Calidad no encontrado para eliminar.');
        }
        throw error;
    }
};