import { Request, Response, NextFunction } from 'express';
import * as TrazabilidadService from '../services/TrazabilidadService';
import { HttpError } from '../middlewares/ErrorHandler';
import { logger } from '../utils/logger';

// ----------------------------------------
// COSECHA CONTROLLERS
// ----------------------------------------

export const createCosecha = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;

    if (!data.id_vinedo || !data.cantidad_kg || !data.fecha_cosecha) {
        return next(new HttpError('Faltan campos obligatorios para Cosecha: id_vinedo, cantidad_kg, fecha_cosecha.', 400));
    }

    try {
        const nuevaCosecha = await TrazabilidadService.createCosecha(data);
        logger.info('Cosecha registrada exitosamente.', { context: 'TrazabilidadController', id: nuevaCosecha.id_cosecha });
        return res.status(201).json({ message: 'Cosecha registrada (RF02).', data: nuevaCosecha });
    } catch (error) {
        if (error instanceof Error && error.message.includes('encontrado')) {
            return next(new HttpError(error.message, 404));
        }
        next(error);
    }
};

export const getCosechas = async (req: Request, res: Response, next: NextFunction) => {
    // Actor: Enólogo/Productor, Administrador
    try {
        const cosechas = await TrazabilidadService.findAllCosechas();
        return res.status(200).json({ data: cosechas });
    } catch (error) {
        next(error);
    }
};

export const updateCosecha = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const data = req.body;

    try {
        const cosechaActualizada = await TrazabilidadService.updateCosecha(id, data);
        return res.status(200).json({ message: 'Cosecha actualizada.', data: cosechaActualizada });
    } catch (error) {
        if (error instanceof Error && error.message.includes('no encontrada')) {
            return next(new HttpError(error.message, 404));
        }
        next(error);
    }
};

export const deleteCosecha = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;

    try {
        const cosechaEliminada = await TrazabilidadService.deleteCosecha(id);
        return res.status(200).json({ message: 'Cosecha eliminada.', data: cosechaEliminada });
    } catch (error) {
        if (error instanceof Error && error.message.includes('no encontrada')) {
            return next(new HttpError(error.message, 404));
        }
        if (error instanceof Error && error.message.includes('asociada')) {
            return next(new HttpError(error.message, 409)); // Conflicto
        }
        next(error);
    }
};

// ----------------------------------------
// LOTE CONTROLLERS
// ----------------------------------------

/**
 * Crea un nuevo Lote de Producción.
 * Requiere: id_vino, id_cosecha, numero_lote, cantidad_botellas
 */
export const createLote = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;

    if (!data.id_vino || !data.id_cosecha || !data.numero_lote || !data.cantidad_botellas || !data.fecha_embotellado) {
        return next(new HttpError('Faltan campos obligatorios para Lote: id_vino, id_cosecha, numero_lote, cantidad_botellas, fecha_embotellado.', 400));
    }

    try {
        const nuevoLote = await TrazabilidadService.createLote(data);
        logger.info(`Lote '${nuevoLote.numero_lote}' registrado.`, { context: 'TrazabilidadController', id: nuevoLote.id_lote });
        return res.status(201).json({ message: 'Lote registrado (RF02).', data: nuevoLote });
    } catch (error: any) {
        if (error instanceof Error && error.message.includes('existente') || error.message.includes('Verifique')) {
            return next(new HttpError(error.message, 409));
        }
        next(error);
    }
};

/**
 * Actualiza parcialmente un Lote.
 * Actor: Enólogo/Productor (RF02)
 */
export const updateLote = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const data = req.body; // Datos parciales (ej. { id_barrica: 'nuevo_id' })

    try {
        const loteActualizado = await TrazabilidadService.updateLote(id, data);
        logger.info(`Lote '${id}' actualizado.`, { context: 'TrazabilidadController', data: loteActualizado });
        return res.status(200).json({ message: 'Lote actualizado.', data: loteActualizado });
    } catch (error: any) {
        if (error instanceof Error && error.message.includes('no encontrado')) {
            return next(new HttpError(error.message, 404));
        }
        if (error instanceof Error && error.message.includes('Barrica proporcionada') || error.message.includes('número de lote')) {
            return next(new HttpError(error.message, 409));
        }
        next(error);
    }
};

/**
 * Obtiene todos los Lotes, incluyendo detalles de Vino y Cosecha.
 */
export const getLotes = async (req: Request, res: Response, next: NextFunction) => {
    // Actor: Enólogo/Productor, Administrador (Lectura de trazabilidad)
    try {
        const lotes = await TrazabilidadService.findAllLotes();
        return res.status(200).json({ data: lotes });
    } catch (error) {
        next(error);
    }
};

/**
 * Elimina un Lote.
 */
export const deleteLote = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;

    try {
        const loteEliminado = await TrazabilidadService.deleteLote(id);
        return res.status(200).json({ message: 'Lote eliminado.', data: loteEliminado });
    } catch (error) {
        if (error instanceof Error && error.message.includes('no encontrado')) {
            return next(new HttpError(error.message, 404));
        }
        if (error instanceof Error && error.message.includes('movimientos')) {
            return next(new HttpError(error.message, 409)); // Conflicto
        }
        next(error);
    }
};

// ----------------------------------------
// PROCESO DE PRODUCCIÓN CONTROLLERS (RF02)
// ----------------------------------------

/**
 * Registra un nuevo paso de producción (Fermentación, Crianza).
 */
export const createProcesoProduccion = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;

    if (!data.id_lote || !data.nombre_proceso || !data.fecha_inicio) {
        return next(new HttpError('Faltan campos obligatorios para Proceso: id_lote, nombre_proceso, fecha_inicio.', 400));
    }

    try {
        const nuevoProceso = await TrazabilidadService.createProcesoProduccion(data);
        logger.info(`Proceso '${nuevoProceso.nombre_proceso}' registrado.`, { context: 'TrazabilidadController', id: nuevoProceso.id_proceso });
        return res.status(201).json({ message: 'Proceso de Producción registrado (RF02).', data: nuevoProceso });
    } catch (error) {
        if (error instanceof Error && error.message.includes('Lote o la Barrica')) {
            return next(new HttpError(error.message, 404));
        }
        next(error);
    }
};

/**
 * Obtiene todos los procesos de producción.
 */
export const getProcesosProduccion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const procesos = await TrazabilidadService.findAllProcesosProduccion();
        return res.status(200).json({ data: procesos });
    } catch (error) {
        next(error);
    }
};

/**
 * Finaliza o actualiza un proceso (ej. establece fecha_fin).
 */
export const updateProcesoProduccion = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const data = req.body;

    try {
        const procesoActualizado = await TrazabilidadService.updateProcesoProduccion(id, data);
        return res.status(200).json({ message: 'Proceso de Producción actualizado.', data: procesoActualizado });
    } catch (error) {
        if (error instanceof Error && error.message.includes('no encontrado')) {
            return next(new HttpError(error.message, 404));
        }
        next(error);
    }
};

/**
 * Elimina un Proceso de Producción.
 * Actor: Administrador (por ser un cambio destructivo)
 */
export const deleteProcesoProduccion = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    
    try {
        const procesoEliminado = await TrazabilidadService.deleteProcesoProduccion(id);
        return res.status(200).json({ message: 'Proceso de Producción eliminado.', data: procesoEliminado });
    } catch (error) {
        if (error instanceof Error && error.message.includes('no encontrado')) {
            return next(new HttpError(error.message, 404));
        }
        if (error instanceof Error && error.message.includes('Control de Calidad')) {
            return next(new HttpError(error.message, 409)); // Conflicto
        }
        next(error);
    }
};

// ----------------------------------------
// CONTROL DE CALIDAD CONTROLLERS (RF02)
// ----------------------------------------

/**
 * Registra un nuevo Control de Calidad (Análisis/Cata).
 */
export const createControlCalidad = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;

    if (!data.id_proceso || !data.fecha_analisis || !data.tipo_control || !data.resultados) {
        return next(new HttpError('Faltan campos obligatorios para Control de Calidad.', 400));
    }

    try {
        const nuevoControl = await TrazabilidadService.createControlCalidad(data);
        logger.info(`Control de Calidad '${nuevoControl.tipo_control}' registrado.`, { context: 'TrazabilidadController', id: nuevoControl.id_control });
        return res.status(201).json({ message: 'Control de Calidad registrado (RF02).', data: nuevoControl });
    } catch (error) {
        if (error instanceof Error && error.message.includes('Proceso de Producción')) {
            return next(new HttpError(error.message, 404));
        }
        next(error);
    }
};

/**
 * Obtiene todos los registros de control de calidad.
 */
export const getControlesCalidad = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const controles = await TrazabilidadService.findAllControlesCalidad();
        return res.status(200).json({ data: controles });
    } catch (error) {
        next(error);
    }
};

/**
 * Actualiza parcialmente un Control de Calidad.
 */
export const updateControlCalidad = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const data = req.body;

    try {
        const controlActualizado = await TrazabilidadService.updateControlCalidad(id, data);
        return res.status(200).json({ message: 'Control de Calidad actualizado.', data: controlActualizado });
    } catch (error) {
        if (error instanceof Error && error.message.includes('no encontrado')) {
            return next(new HttpError(error.message, 404));
        }
        next(error);
    }
};


/**
 * Elimina un Control de Calidad.
 * Actor: Enólogo/Productor (permite corregir un error de entrada)
 */
export const deleteControlCalidad = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    
    try {
        const controlEliminado = await TrazabilidadService.deleteControlCalidad(id);
        return res.status(200).json({ message: 'Control de Calidad eliminado.', data: controlEliminado });
    } catch (error) {
        if (error instanceof Error && error.message.includes('no encontrado')) {
            return next(new HttpError(error.message, 404));
        }
        next(error);
    }
};