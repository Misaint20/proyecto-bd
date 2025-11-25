import prisma from '../lib/PrismaService';
import { Inventario } from '../generated/prisma/client';
import { CreateInventarioData } from '../types/inventario';
import { generateUuid } from '../lib/IdGenerator';
import { Prisma } from '../generated/prisma/client';
import { logger } from '../utils/logger';

// ----------------------------------------
// SERVICIOS PARA INVENTARIO (RF01)
// ----------------------------------------

/**
 * Registra o actualiza el stock de un Lote en una Ubicación específica.
 * NOTA: Esta operación debe ser atómica (transacción) para evitar condiciones de carrera.
 * Actor: Encargado de Bodega.
 */
export const createOrUpdateInventario = async (data: CreateInventarioData): Promise<Inventario> => {
    
    // El ID del registro de Inventario
    const newId = generateUuid();
    
    // Verificación de integridad: Lote debe existir
    try {
        await prisma.lote.findUniqueOrThrow({ where: { id_lote: data.id_lote } });
    } catch (e) {
        throw new Error('El Lote de producción proporcionado no existe.');
    }

    try {
        // Usamos una transacción para garantizar atomicidad en la operación.
        const result = await prisma.$transaction(async (tx) => {

            // 0. Verificar que el lote exista y obtener su cantidad actual
            const lote = await tx.lote.findUniqueOrThrow({ where: { id_lote: data.id_lote } });

            // Si la operación es negativa, verificar que el lote tenga suficientes botellas
            if (data.cantidad_botellas < 0 && lote.cantidad_botellas + data.cantidad_botellas < 0) {
                throw new Error('No hay suficientes botellas en el Lote seleccionado para realizar esta operación.');
            }

            // 1. Intentar encontrar un registro existente para ese lote y ubicación
            const existingInventory = await tx.inventario.findFirst({
                where: {
                    id_lote: data.id_lote,
                    ubicacion: data.ubicacion,
                },
            });

            let inventoryRecord: Inventario;
            if (existingInventory) {
                // Si ya existe un registro de inventario para esa ubicación, lo devolvemos tal cual.
                inventoryRecord = existingInventory;
            } else {
                // Si no existe registro y se intenta retirar (cantidad negativa), eso no tiene sentido
                // porque no hay un registro de ubicación desde la que retirar.
                if (data.cantidad_botellas < 0) {
                    throw new Error('No es posible retirar desde una ubicación sin registro de inventario.');
                }

                // Crear el registro de inventario (sin cantidad de botellas)
                inventoryRecord = await tx.inventario.create({
                    data: {
                        id_inventario: newId,
                        id_lote: data.id_lote,
                        ubicacion: data.ubicacion,
                    },
                });
            }

            // 2. Actualizar la cantidad total del Lote (reflejar la entrada/salida)
            await tx.lote.update({
                where: { id_lote: data.id_lote },
                data: { cantidad_botellas: { increment: data.cantidad_botellas } },
            });

            return inventoryRecord;
        });

        return result;
    } catch (error) {
        logger.error('Error al registrar/actualizar Inventario.', { context: 'InventarioService', error });
        // Prisma ya maneja el rollback automático de la transacción en caso de error
        throw error;
    }
};

/**
 * Obtiene el inventario actual (stock) por ubicación y lote.
 */
export const findAllInventario = async (): Promise<Inventario[]> => {
    return prisma.inventario.findMany({
        include: { Lote: { include: { Vino: true } } }, // Incluir el Vino asociado para la consulta
    });
};

/**
 * Obtiene el stock de un lote específico.
 */
export const findStockByLote = async (id_lote: string): Promise<Inventario[]> => {
    return prisma.inventario.findMany({
        where: { id_lote },
        include: { Lote: { include: { Vino: true } } },
    });
};

/**
 * Elimina un registro de inventario (Solo para correcciones o ajustes por parte del Administrador).
 */
export const deleteInventarioRecord = async (id: string): Promise<Inventario> => {
    try {
        return await prisma.inventario.delete({
            where: { id_inventario: id },
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new Error('Registro de Inventario no encontrado para eliminar.');
        }
        throw error;
    }
};