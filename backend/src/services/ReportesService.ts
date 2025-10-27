import prisma from '../lib/PrismaService';
import { logger } from '../utils/logger';

// ----------------------------------------
// SERVICIOS PARA REPORTES (RF03)
// ----------------------------------------

/**
 * Reporte 1: Obtiene el valor monetario actual de todo el stock en inventario.
 * Requiere JOIN entre Inventario, Lote, y Vino.
 * Actor: Administrador.
 */
export const getInventarioValorizado = async () => {
    logger.info('Generando reporte de Inventario Valorizado.', { context: 'ReportesService' });

    // Consulta para sumar la cantidad de botellas y calcular el valor total
    // (Stock * Precio Venta) por cada lote en inventario.
    const inventarioValorizado = await prisma.inventario.findMany({
        select: {
            cantidad_botellas: true,
            ubicacion: true,
            Lote: {
                select: {
                    numero_lote: true,
                    Vino: {
                        select: {
                            nombre: true,
                            precio_botella: true,
                        }
                    }
                }
            }
        }
    });

    // Calcular el total y formatear la salida
    let valorTotal = 0;
    const detalles = inventarioValorizado.map(item => {
        const precio = item.Lote.Vino.precio_botella.toNumber();
        const valorLote = item.cantidad_botellas * precio;
        valorTotal += valorLote;

        return {
            numero_lote: item.Lote.numero_lote,
            vino: item.Lote.Vino.nombre,
            ubicacion: item.ubicacion,
            stock: item.cantidad_botellas,
            precio_unitario: precio,
            valor_stock_lote: valorLote,
        };
    });

    return {
        valor_total_inventario: valorTotal,
        detalles: detalles,
    };
};

/**
 * Reporte 2: Obtiene el volumen de ventas por período (ej. total de ventas y cantidad de botellas).
 * Actor: Administrador.
 */
export const getReporteVentasPorPeriodo = async (startDate: string, endDate: string) => {
    logger.info(`Generando reporte de ventas de ${startDate} a ${endDate}.`, { context: 'ReportesService' });

    // Operación de agregación para sumar los totales de venta y las cantidades
    const ventas = await prisma.venta.findMany({
        where: {
            fecha_venta: {
                gte: new Date(startDate), // Greater than or equal (>=)
                lte: new Date(endDate), // Less than or equal (<=)
            }
        },
        include: { Detalle_Venta: true }
    });

    let totalIngresos = 0;
    let totalBotellas = 0;

    // Agregar totales de los detalles
    ventas.forEach(venta => {
        venta.Detalle_Venta.forEach(detalle => {
            totalBotellas += detalle.cantidad;
            totalIngresos += detalle.subtotal.toNumber();
        });
    });

    return {
        periodo: `${startDate} a ${endDate}`,
        numero_transacciones: ventas.length,
        total_ingresos: totalIngresos,
        total_botellas_vendidas: totalBotellas,
        detalles_ventas: ventas.map(v => ({
            id_venta: v.id_venta,
            fecha: v.fecha_venta,
            total: v.total.toNumber(),
            cliente: v.cliente
        }))
    };
};