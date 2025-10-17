import prisma from '../lib/PrismaService';
import { Vinedo, Varietal, Barrica, Mezcla_Vino } from '@prisma/client';
import { CreateVinedoData, UpdateVinedoData, CreateVarietalData, UpdateVarietalData, BarricaCreationData, BarricaUpdateData, CreateMezclaVinoData } from '../types/maestros';
import { generateUuid } from '../lib/IdGenerator';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { logger } from '../utils/logger';

/*
    Servicio para gestionar los registros de viñedos
*/

export const createVinedo = async (data: CreateVinedoData): Promise<Vinedo> => {
    const newId = generateUuid();
    logger.info(`Intentando crear viñedo con ID: ${newId}`, { context: 'MaestrosService' });

    try {
        return await prisma.vinedo.create({
            data: {
                id_vinedo: newId,
                ...data,
            },
        });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
            logger.warn('Error al crear viñedo: Nombre o campo único duplicado.', { context: 'MaestrosService', error });
            throw new Error('Ya existe un viñedo con el mismo nombre o contacto único.');
        }
        logger.error('Error desconocido al crear viñedo.', { context: 'MaestrosService', error });
        throw error;
    }
};

export const findAllVinedos = async (): Promise<Vinedo[]> => {
    return prisma.vinedo.findMany();
};

export const updateVinedo = async (id: string, data: UpdateVinedoData): Promise<Vinedo> => {
    try {
        return await prisma.vinedo.update({
            where: { id_vinedo: id },
            data: data as any,
        });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new Error('Viñedo no encontrado para actualizar.');
        }
        throw error;
    }
};

export const deleteVinedo = async (id: string): Promise<Vinedo> => {
    try {
        return await prisma.vinedo.delete({
            where: { id_vinedo: id },
        });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new Error('Viñedo no encontrado para eliminar.');
        }
        throw error;
    }
};

/*
    Servicio para gestionar los registros de varietales
*/

export const createVarietal = async (data: CreateVarietalData): Promise<Varietal> => {
    const newId = generateUuid();

    try {
        return await prisma.varietal.create({
            data: {
                id_varietal: newId,
                ...data,
            },
        });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
            throw new Error('Ya existe un varietal con el mismo nombre.');
        }
        throw error;
    }
};

export const findAllVarietales = async (): Promise<Varietal[]> => {
    return prisma.varietal.findMany();
};


export const updateVarietal = async (id: string, data: UpdateVarietalData): Promise<Varietal> => {
    try {
        return await prisma.varietal.update({
            where: { id_varietal: id },
            data: data as any,
        });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new Error('Varietal no encontrado para actualizar.');
        }
        throw error;
    }
};

export const deleteVarietal = async (id: string): Promise<Varietal> => {
    try {
        return await prisma.varietal.delete({
            where: { id_varietal: id },
        });
    } catch (error) {
        // P2003 indica que la restricción de clave foránea ha fallado 
        // (el varietal está en uso en Mezcla_Vino)
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2003') {
            throw new Error('No se puede eliminar el varietal porque está asociado a una o más mezclas de vino (integridad referencial).');
        }
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new Error('Varietal no encontrado para eliminar.');
        }
        throw error;
    }
};

/*
    Servicio para gestionar los registros de barricas
*/

export const createBarrica = async (data: BarricaCreationData): Promise<Barrica> => {
    const newId = generateUuid();

    try {
        return await prisma.barrica.create({
            data: {
                id_barrica: newId,
                ...data,
                // El costo se convierte automáticamente a Decimal por Prisma
            },
        });
    } catch (error) {
        logger.error('Error al crear barrica.', { context: 'MaestrosService', error });
        throw error;
    }
};

export const findAllBarricas = async (): Promise<Barrica[]> => {
    return prisma.barrica.findMany();
};

export const updateBarrica = async (id: string, data: BarricaUpdateData): Promise<Barrica> => {
    try {
        return await prisma.barrica.update({
            where: { id_barrica: id },
            data: data as any,
        });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new Error('Barrica no encontrada para actualizar.');
        }
        throw error;
    }
};

export const deleteBarrica = async (id: string): Promise<Barrica> => {
    try {
        return await prisma.barrica.delete({
            where: {
                id_barrica: id,
            },
        });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new Error('Barrica no encontrada para eliminar.');
        }
        throw error;
    }
};

/*
    Servicio para gestionar las mezclas de vino
*/

export const createMezclaVino = async (data: CreateMezclaVinoData): Promise<Mezcla_Vino> => {
    const newId = generateUuid();

    // NOTA: La unicidad (id_vino, id_varietal) se verifica automáticamente por la DB (P2002)
    try {
        return await prisma.mezcla_Vino.create({
            data: {
                id_mezcla: newId,
                ...data,
            },
            // Incluimos las relaciones para devolver un objeto completo
            include: { Vino: true, Varietal: true },
        });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
            throw new Error('El varietal ya está registrado para este vino.');
        }
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2003') {
            throw new Error('El ID de Vino o Varietal proporcionado no existe (integridad referencial).');
        }
        logger.error('Error desconocido al crear mezcla de vino.', { context: 'MaestrosService', error });
        throw error;
    }
};

export const findAllMezclasVino = async (): Promise<Mezcla_Vino[]> => {
    return prisma.mezcla_Vino.findMany({
        include: { Vino: true, Varietal: true },
    });
};

export const deleteMezclaVino = async (id: string): Promise<Mezcla_Vino> => {
    try {
        return await prisma.mezcla_Vino.delete({
            where: { id_mezcla: id },
        });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new Error('Mezcla de Vino no encontrada para eliminar.');
        }
        throw error;
    }
};
