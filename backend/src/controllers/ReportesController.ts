// src/controllers/ReportesController.ts
import { Request, Response, NextFunction } from 'express';
import * as ReportesService from '../services/ReportesService';
import { HttpError } from '../middlewares/ErrorHandler';
import { logger } from '../utils/logger';

// ----------------------------------------
// REPORTES CONTROLLERS (RF03)
// ----------------------------------------

/**
 * GET /api/reportes/inventario/valorizado
 * Muestra el valor monetario total del stock.
 * Actor: Administrador.
 */
export const getInventarioValorizado = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reporte = await ReportesService.getInventarioValorizado();
        return res.status(200).json({ message: 'Reporte de Inventario Valorizado (RF03).', data: reporte });
    } catch (error) {
        logger.error('Error al generar reporte de inventario valorizado.', { context: 'ReportesController', error });
        next(error);
    }
};

/**
 * GET /api/reportes/ventas/periodo?start=...&end=...
 * Muestra el total de ventas en un rango de fechas.
 * Actor: Administrador.
 */
export const getReporteVentasPorPeriodo = async (req: Request, res: Response, next: NextFunction) => {
    const { start, end } = req.query;

    if (!start || !end || typeof start !== 'string' || typeof end !== 'string') {
        return next(new HttpError('Se requieren los parámetros de consulta \'start\' y \'end\' en formato ISO 8601.', 400));
    }

    try {
        const reporte = await ReportesService.getReporteVentasPorPeriodo(start, end);
        return res.status(200).json({ message: 'Reporte de Ventas por Período (RF03).', data: reporte });
    } catch (error) {
        logger.error('Error al generar reporte de ventas por período.', { context: 'ReportesController', error });
        next(error);
    }
};