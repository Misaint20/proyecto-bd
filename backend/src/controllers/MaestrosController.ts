import { Request, Response, NextFunction } from 'express';
import * as MaestrosService from '../services/MaestrosService';
import { HttpError } from '../middlewares/ErrorHandler';
import { logger } from '../utils/logger';

export const createVinedo = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    
    if (!data.nombre ||!data.ubicacion ||!data.contacto) {
        return next(new HttpError('Faltan campos obligatorios para el Viñedo: nombre, ubicacion, contacto.', 400));
    }
    
    try {
        const nuevoVinedo = await MaestrosService.createVinedo(data);
        logger.info('Viñedo creado exitosamente.', { context: 'MaestrosController', id: nuevoVinedo.id_vinedo });
        return res.status(201).json({ message: 'Viñedo creado.', data: nuevoVinedo });
    } catch (error) {
        if (error instanceof Error && error.message.includes('duplicado')) {
            return next(new HttpError(error.message, 409));
        }
        next(error);
    }
};

export const getVinedos = async (req: Request, res: Response, next: NextFunction) => {
    // Requiere Rol: Administrador, Encargado de Bodega, Enólogo/Productor (Lectura)
    try {
        const vinedos = await MaestrosService.findAllVinedos();
        return res.status(200).json({ data: vinedos });
    } catch (error) {
        next(error);
    }
};

export const updateVinedo = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const data = req.body;
    
    try {
        const vinedoActualizado = await MaestrosService.updateVinedo(id, data);
        return res.status(200).json({ message: 'Viñedo actualizado.', data: vinedoActualizado });
    } catch (error) {
        if (error instanceof Error && error.message.includes('no encontrado')) {
            return next(new HttpError(error.message, 404));
        }
        next(error);
    }
};

export const deleteVinedo = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    
    try {
        const vinedoEliminado = await MaestrosService.deleteVinedo(id);
        return res.status(200).json({ message: 'Viñedo eliminado.', data: vinedoEliminado });
    } catch (error) {
        if (error instanceof Error && error.message.includes('no encontrado')) {
            return next(new HttpError(error.message, 404));
        }
        next(error);
    }
};

export const createVarietal = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    
    if (!data.nombre) {
        return next(new HttpError('Falta el campo obligatorio para Varietal: nombre.', 400));
    }
    
    try {
        const nuevoVarietal = await MaestrosService.createVarietal(data);
        logger.info('Varietal creado exitosamente.', { context: 'MaestrosController', id: nuevoVarietal.id_varietal });
        return res.status(201).json({ message: 'Varietal creado.', data: nuevoVarietal });
    } catch (error) {
        if (error instanceof Error && error.message.includes('duplicado')) {
            return next(new HttpError(error.message, 409));
        }
        next(error);
    }
};

export const getVarietales = async (req: Request, res: Response, next: NextFunction) => {
    // Requiere Lectura general (Todos los roles que usan trazabilidad)
    try {
        const varietales = await MaestrosService.findAllVarietales();
        return res.status(200).json({ data: varietales });
    } catch (error) {
        next(error);
    }
};

export const updateVarietal = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const data = req.body;
    
    try {
        const varietalActualizado = await MaestrosService.updateVarietal(id, data);
        return res.status(200).json({ message: 'Varietal actualizado.', data: varietalActualizado });
    } catch (error) {
        if (error instanceof Error && error.message.includes('no encontrado')) {
            return next(new HttpError(error.message, 404));
        }
        next(error);
    }
};

export const deleteVarietal = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    
    try {
        const varietalEliminado = await MaestrosService.deleteVarietal(id);
        return res.status(200).json({ message: 'Varietal eliminado.', data: varietalEliminado });
    } catch (error) {
        if (error instanceof Error && error.message.includes('no encontrado')) {
            return next(new HttpError(error.message, 404));
        }
        // Manejar el error de clave foránea (P2003)
        if (error instanceof Error && error.message.includes('integridad referencial')) {
            return next(new HttpError(error.message, 409)); // 409 Conflict
        }
        next(error);
    }
};

export const createBarrica = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    
    if (!data.tipo_madera ||!data.capacidad_litros ||!data.fecha_compra ||!data.costo) {
        return next(new HttpError('Faltan campos obligatorios para Barrica: tipo_madera, capacidad_litros, fecha_compra, costo.', 400));
    }
    
    try {
        const nuevaBarrica = await MaestrosService.createBarrica(data);
        logger.info('Barrica creada exitosamente.', { context: 'MaestrosController', id: nuevaBarrica.id_barrica });
        return res.status(201).json({ message: 'Barrica creada.', data: nuevaBarrica });
    } catch (error) {
        next(error);
    }
};

export const getBarricas = async (req: Request, res: Response, next: NextFunction) => {
    // Requiere Rol: Enólogo/Productor, Administrador
    try {
        const barricas = await MaestrosService.findAllBarricas();
        return res.status(200).json({ data: barricas });
    } catch (error) {
        next(error);
    }
};

export const updateBarrica = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const data = req.body;
    
    try {
        const barricaActualizada = await MaestrosService.updateBarrica(id, data);
        return res.status(200).json({ message: 'Barrica actualizada.', data: barricaActualizada });
    } catch (error) {
        if (error instanceof Error && error.message.includes('no encontrado')) {
            return next(new HttpError(error.message, 404));
        }
        next(error);
    }
};

export const deleteBarrica = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    
    try {
        const barricaEliminada = await MaestrosService.deleteBarrica(id);
        return res.status(200).json({ message: 'Barrica eliminada.', data: barricaEliminada });
    } catch (error) {
        if (error instanceof Error && error.message.includes('no encontrado')) {
            return next(new HttpError(error.message, 404));
        }
        next(error);
    }
};

export const createMezclaVino = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    
    if (!data.id_vino ||!data.id_varietal || data.porcentaje === undefined) {
        return next(new HttpError('Faltan campos obligatorios para Mezcla de Vino: id_vino, id_varietal, porcentaje.', 400));
    }
    
    try {
        const nuevaMezcla = await MaestrosService.createMezclaVino(data);
        logger.info('Mezcla de Vino creada exitosamente.', { context: 'MaestrosController', id: nuevaMezcla.id_mezcla });
        return res.status(201).json({ message: 'Mezcla de Vino creada.', data: nuevaMezcla });
    } catch (error) {
        if (error instanceof Error && error.message.includes('existente')) {
            return next(new HttpError(error.message, 409));
        }
        if (error instanceof Error && error.message.includes('integridad referencial')) {
            return next(new HttpError(error.message, 404)); // 404 si el padre no existe
        }
        next(error);
    }
};

export const getMezclasVino = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const mezclas = await MaestrosService.findAllMezclasVino();
        return res.status(200).json({ data: mezclas });
    } catch (error) {
        next(error);
    }
};

export const updateMezclaVino = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const body = req.body;

    try {
        const mezclaActualizada = await MaestrosService.updateMezclaVino(id, body);
        return res.status(200).json({ message: 'Mezcla de Vino actualizada.', data: mezclaActualizada });
    } catch (error) {
        if (error instanceof Error && error.message.includes('no encontrada')) {
            return next(new HttpError(error.message, 404));
        }
        next(error);
    }
};

export const deleteMezclaVino = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    
    try {
        const mezclaEliminada = await MaestrosService.deleteMezclaVino(id);
        return res.status(200).json({ message: 'Mezcla de Vino eliminada.', data: mezclaEliminada });
    } catch (error) {
        if (error instanceof Error && error.message.includes('no encontrada')) {
            return next(new HttpError(error.message, 404));
        }
        next(error);
    }
};