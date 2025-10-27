// src/services/VentasService.ts (Fragmento crucial de la función registerVentaTransaction)
import prisma from '../lib/PrismaService';
import { Venta, Detalle_Venta, Inventario } from '@prisma/client';
import { VentaCreationData} from '../types/ventas';
import { generateUuid } from '../lib/IdGenerator';
import { logger } from '../utils/logger';

// Usamos el tipo complejo de transacción para asegurar la atomicidad (ACID)
type VentaTransactionResult = Venta & { detalles: Detalle_Venta[]; total: number; };

export const registerVentaTransaction = async (
    data: VentaCreationData, 
): Promise<VentaTransactionResult> => {
    
    const ventaId = generateUuid();
    // Aunque calculamos el total, solo lo usaremos para la respuesta, no para la DB.
    let totalVenta = 0; 

    try {
        const result = await prisma.$transaction(async (tx) => {
            const detalleCreations: Promise<Detalle_Venta>[] = [];
            const inventoryUpdates: Promise<Inventario>[] = [];
            
            // 1. Verificar stock y construir detalles de venta
            for (const item of data.detalles) {

                const lote = await tx.lote.findUnique({
                    where: { id_lote: item.id_lote },
                    select: { 
                        cantidad_botellas: true,
                        numero_lote: true,
                        Vino: { select: { precio_botella: true } } 
                    }
                });

                if (!lote) {
                    throw new Error(`Lote ${item.id_lote} no encontrado.`);
                }

                // Cálculo de subtotal y suma a totalVenta
                const precioDecimal = lote.Vino.precio_botella;
                const precioUnitario = typeof precioDecimal === 'number'? precioDecimal : precioDecimal.toNumber();
                
                const subtotal = precioUnitario * item.cantidad;
                totalVenta += subtotal; 
                
                // 1.1. Preparamos la deducción de stock (RF01)
                const inventarioRecord = await tx.inventario.findFirst({
                    where: { id_lote: item.id_lote }
                });

                if (!inventarioRecord) {
                    throw new Error(`El Lote ${lote.numero_lote} no tiene stock registrado en ninguna ubicación.`);
                }

                inventoryUpdates.push(
                    tx.inventario.update({
                        where: { id_inventario: inventarioRecord.id_inventario },
                        data: {
                            cantidad_botellas: {
                                decrement: item.cantidad, // Deducción atómica
                            }
                        }
                    })
                );

                // 1.2. Creación del Detalle_Venta (INSERTA SUBTOTAL Y PRECIO)
                detalleCreations.push(
                    tx.detalle_Venta.create({
                        data: {
                            id_detalle: generateUuid(),
                            id_venta: ventaId,
                            id_vino: item.id_vino,
                            cantidad: item.cantidad,
                            precio_unitario: precioUnitario, 
                            subtotal: subtotal,
                        }
                    })
                );
            }
            
            // 2. Crear el encabezado de Venta (RF03)
            const ventaHeader = await tx.venta.create({
                data: {
                    id_venta: ventaId,
                    fecha_venta: data.fecha_venta,
                    cliente: data.cliente,
                    total: totalVenta,
                } 
            });
            
            // 3. Ejecutar la deducción de inventario y los detalles de venta
            const createdDetails = await Promise.all(detalleCreations);
            await Promise.all(inventoryUpdates);
            
            // 4. Devolver el total calculado en la capa de aplicación
            return {...ventaHeader, detalles: createdDetails, total: totalVenta };

        });
        
        // 5. El retorno debe ser tipado para incluir el total calculado
        return result as VentaTransactionResult;

    } catch (error) {
        logger.error('Fallo de Transacción de Venta.', { context: 'VentasService', error });
        throw error;
    }
};

/**
 * Obtiene todas las ventas registradas.
 */
export const findAllVentas = async (): Promise<Venta[]> => {
    // Nota: Al consultar, el total DEBE ser calculado en el frontend o en un getter del servicio
    return prisma.venta.findMany({
        include: { Detalle_Venta: { include: { Vino: true } } },
    });
};