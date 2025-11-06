import { Request, Response, NextFunction } from 'express';
import * as InventarioService from '../services/InventarioService';
import { HttpError } from '../middlewares/ErrorHandler';
import { logger } from '../utils/logger';

// ----------------------------------------
// INVENTARIO CONTROLLERS (RF01)
// ----------------------------------------

/**
 * Registra entrada o ajusta stock de un lote.
 * Actor: Encargado de Bodega, Administrador.
 */
export const registerInventoryEntry = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    
    if (!data.id_lote ||!data.ubicacion ||!data.cantidad_botellas) {
        return next(new HttpError('Faltan campos obligatorios para Inventario: id_lote, ubicacion, cantidad_botellas.', 400));
    }
    
    try {
        const nuevoStock = await InventarioService.createOrUpdateInventario(data);
        logger.info(`Entrada de inventario registrada para Lote: ${data.id_lote}`, { context: 'InventarioController', stockId: nuevoStock.id_inventario });
        return res.status(201).json({ message: 'Stock de Inventario actualizado (RF01).', data: nuevoStock });
    } catch (error) {
        if (error instanceof Error && error.message.includes('Lote de producción')) {
            return next(new HttpError(error.message, 404));
        }
        next(error);
    }
};

/**
 * Obtiene el stock actual.
 * Actor: Todos (Lectura)
 */
export const getInventario = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const inventario = await InventarioService.findAllInventario();
        return res.status(200).json({ data: inventario });
    } catch (error) {
        next(error);
    }
};

/**
 * Elimina un registro de Inventario (Solo Administrador para correcciones).
 */
export const deleteInventario = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    
    try {
        const registroEliminado = await InventarioService.deleteInventarioRecord(id);
        return res.status(200).json({ message: 'Registro de Inventario eliminado.', data: registroEliminado });
    } catch (error) {
        if (error instanceof Error && error.message.includes('no encontrado')) {
            return next(new HttpError(error.message, 404));
        }
        next(error);
    }
};