import prisma from '../lib/PrismaService';
import { Inventario } from '@prisma/client';
import { CreateInventarioData, UpdateInventarioData } from '../types/inventario';
import { generateUuid } from '../lib/IdGenerator';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
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
        // Usamos una transacción para garantizar atomicidad en la operación
        const result = await prisma.$transaction(async (tx) => {
            
            // 1. Intentar encontrar un registro existente para ese lote y ubicación
            const existingInventory = await tx.inventario.findFirst({
                where: {
                    id_lote: data.id_lote,
                    ubicacion: data.ubicacion,
                },
            });

            if (existingInventory) {
                // 2. Si existe, actualizar la cantidad sumando el nuevo valor
                return tx.inventario.update({
                    where: { id_inventario: existingInventory.id_inventario },
                    data: {
                        cantidad_botellas: existingInventory.cantidad_botellas + data.cantidad_botellas,
                    },
                });
            } else {
                // 3. Si no existe, crear un nuevo registro
                return tx.inventario.create({
                    data: {
                        id_inventario: newId,
                        id_lote: data.id_lote,
                        ubicacion: data.ubicacion,
                        cantidad_botellas: data.cantidad_botellas,
                    },
                });
            }
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
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new Error('Registro de Inventario no encontrado para eliminar.');
        }
        throw error;
    }
};