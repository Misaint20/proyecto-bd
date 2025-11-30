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
            ubicacion: true,
            Lote: {
                select: {
                    numero_lote: true,
                    cantidad_botellas: true,
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
        const valorLote = item.Lote.cantidad_botellas * precio;
        valorTotal += valorLote;

        return {
            numero_lote: item.Lote.numero_lote,
            vino: item.Lote.Vino.nombre,
            ubicacion: item.ubicacion,
            stock: item.Lote.cantidad_botellas,
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

/**
 * Reporte 3: Obtiene las ventas del mes actual y porcentaje de cambio vs mes anterior.
 * Actor: Administrador.
 */
export const getVentasMesActual = async () => {
    logger.info('Generando reporte de ventas del mes actual.', { context: 'ReportesService' });

    const hoy = new Date();
    const primerDiaActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const ultimoDiaActual = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

    // Primer y último día del mes anterior
    const primerDiaAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
    const ultimoDiaAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0);

    // Ventas del mes actual
    const ventasActuales = await prisma.venta.findMany({
        where: {
            fecha_venta: {
                gte: primerDiaActual,
                lte: ultimoDiaActual,
            }
        },
        include: { Detalle_Venta: true }
    });

    // Ventas del mes anterior
    const ventasAnteriores = await prisma.venta.findMany({
        where: {
            fecha_venta: {
                gte: primerDiaAnterior,
                lte: ultimoDiaAnterior,
            }
        },
        include: { Detalle_Venta: true }
    });

    // Calcular totales mes actual
    let totalActual = 0;
    let botellasActual = 0;
    ventasActuales.forEach(venta => {
        venta.Detalle_Venta.forEach(detalle => {
            totalActual += detalle.subtotal.toNumber();
            botellasActual += detalle.cantidad;
        });
    });

    // Calcular totales mes anterior
    let totalAnterior = 0;
    let botellasAnterior = 0;
    ventasAnteriores.forEach(venta => {
        venta.Detalle_Venta.forEach(detalle => {
            totalAnterior += detalle.subtotal.toNumber();
            botellasAnterior += detalle.cantidad;
        });
    });

    // Calcular porcentajes de cambio
    const porcentajeCambio = totalAnterior === 0 ? 100 : ((totalActual - totalAnterior) / totalAnterior) * 100;
    const porcentajeBotella = botellasAnterior === 0 ? 100 : ((botellasActual - botellasAnterior) / botellasAnterior) * 100;

    return {
        mes_actual: {
            total_ventas: totalActual,
            total_botellas: botellasActual,
            numero_transacciones: ventasActuales.length,
        },
        mes_anterior: {
            total_ventas: totalAnterior,
            total_botellas: botellasAnterior,
            numero_transacciones: ventasAnteriores.length,
        },
        cambio_porcentaje: Math.round(porcentajeCambio * 100) / 100,
        cambio_botellas_porcentaje: Math.round(porcentajeBotella * 100) / 100,
    };
};