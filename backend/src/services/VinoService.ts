import prisma from '../lib/PrismaService';
import { CreateVinoData, UpdateVinoData } from '../types/vino';

// RF01: Obtener todos los vinos, incluyendo la mezcla si aplica
export const findAllVinos = async () => {
    return prisma.vino.findMany({
        // Incluir relaciones importantes (ejemplo: la mezcla del vino)
        include: { Mezcla_Vino: true }
    });
};

// RF01: Obtener un vino por su ID
export const findVinoById = async (id: string) => {
    return prisma.vino.findUnique({
        where: { id_vino: id },
        include: { Lote: true } // Para trazabilidad (RF02)
    });
};

// RF01: Crear un nuevo registro de vino
export const createVino = async (data: CreateVinoData) => {
    return prisma.vino.create({ data });
};


// RF01: Eliminar un vino
export const deleteVino = async (id: string) => {
    return prisma.vino.delete({
        where: { id_vino: id },
    });
};

// RF01: Actualizar un vino existente
export const updateVino = async (id: string, data: UpdateVinoData)=> {
    try {
        // Prisma realiza automáticamente la actualización parcial: 
        // solo los campos en 'data' son modificados.
        return await prisma.vino.update({
            where: { id_vino: id },
            data: data,
        });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
            // Error si el registro no existe
            throw new Error('Vino no encontrado para actualizar.');
        }
        throw error;
    }
};