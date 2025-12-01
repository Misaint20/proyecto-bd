import { Request, Response, NextFunction } from 'express';
import * as VentasService from '../services/VentasService';
import { HttpError } from '../middlewares/ErrorHandler';
import { AuthRequest } from '../middlewares/AuthMiddleware'; 
import { logger } from '../utils/logger';

// ----------------------------------------
// VENTAS CONTROLLERS (RF03)
// ----------------------------------------

/**
 * Registra una nueva venta (Transacción Atómica).
 * Actor: Vendedor, Encargado de Bodega.
 */
export const registerVenta = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const data = req.body;
    
    if (!req.user ||!req.user.sub) {
        return next(new HttpError('Fallo de autenticación: ID de vendedor no encontrado.', 401));
    }
    
    if (!data.fecha_venta ||!data.detalles || data.detalles.length === 0) {
        return next(new HttpError('Faltan campos obligatorios: fecha_venta y detalles (productos vendidos).', 400));
    }
    
    // El ID del vendedor se extrae del JWT (RNF04)
    const id_vendedor = req.user.sub;

    try {
        const ventaRegistrada = await VentasService.registerVentaTransaction(data);
        logger.info(`Venta registrada exitosamente. Total: ${ventaRegistrada.total.toString()}`, { context: 'VentasController', ventaId: ventaRegistrada.id_venta, vendedorId: id_vendedor });
        
        // Respuesta RNF03: Transacción completada rápidamente
        return res.status(201).json({ message: 'Venta registrada, stock actualizado (RF03/RF01).', data: ventaRegistrada });
    } catch (error: any) {
        // Manejo de errores de stock insuficiente o lote inexistente
        if (error instanceof Error && error.message.includes('Stock insuficiente') || error.message.includes('Lote')) {
            return next(new HttpError(error.message, 409)); // Conflicto
        }
        next(error);
    }
};

/**
 * Obtiene todas las ventas (Para reportes y auditoría).
 * Actor: Administrador, Vendedor.
 */
export const getVentas = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ventas = await VentasService.findAllVentas();
        return res.status(200).json({ data: ventas });
    } catch (error) {
        next(error);
    }
};

/**
 * Obtiene una venta especifica con sus detalles.
 * Actor: Administrador, Vendedor.
 */
export const getVentaById = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    
    try {
        const venta = await VentasService.findVentaById(id);
        return res.status(200).json({ data: venta });
    } catch (error) {
        if (error instanceof Error && error.message.includes('no encontrada')) {
            return next(new HttpError(error.message, 404));
        }
        next(error);
    }
};

/**
 * Elimina una venta (Para reportes y auditoría).
 * Actor: Administrador, Vendedor.
 */
export const deleteVenta = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    
    try {
        const ventaEliminada = await VentasService.deleteVenta(id);
        return res.status(200).json({ message: 'Venta eliminada.', data: ventaEliminada });
    } catch (error) {
        if (error instanceof Error && error.message.includes('no encontrada')) {
            return next(new HttpError(error.message, 404));
        }
        next(error);
    }
};
