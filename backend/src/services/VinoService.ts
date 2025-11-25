import prisma from '../lib/PrismaService';
import { Prisma } from '../generated/prisma/client';
import { CreateVinoData, UpdateVinoData } from '../types/vino';
import { generateUuid } from '../lib/IdGenerator'; 

// RF01: Obtener todos los vinos, incluyendo la mezcla si aplica
export const findAllVinos = async () => {
    // Buscamos vinos con sus lotes para poder calcular dinámicamente los meses en barrica
    const vinos = await prisma.vino.findMany({
        include: { Mezcla_Vino: true, Lote: true }
    });

    // Calculamos meses en barrica a partir de la(s) fecha(s) de embotellado de Lote(s) que tuvieron barrica
    const now = new Date();
    const computeMonths = (date?: Date | string | null) => {
        if (!date) return 0;
        const d = new Date(date);
        const months = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
        return months > 0 ? months : 0;
    };

    return vinos.map(v => {
        // Consideramos lotes que tienen una barrica asociada como "en barrica"; tomamos el máximo tiempo entre lotes
        const mesesMax = (v.Lote || [])
            .filter(l => (l as any).id_barrica)
            .map(l => computeMonths((l as any).fecha_embotellado))
            .reduce((acc, cur) => Math.max(acc, cur), 0);

        return {
            ...v,
            // Sobrescribimos el valor almacenado con el cálculo dinámico (no se persiste en DB aquí)
            meses_barrica: mesesMax,
        };
    });
};

// RF01: Obtener un vino por su ID
export const findVinoById = async (id: string) => {
    const vino = await prisma.vino.findUnique({
        where: { id_vino: id },
        include: { Lote: true, Mezcla_Vino: true }, // incluimos lotes para calcular meses en barrica
    });

    if (!vino) return null;

    const now = new Date();
    const computeMonths = (date?: Date | string | null) => {
        if (!date) return 0;
        const d = new Date(date);
        const months = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
        return months > 0 ? months : 0;
    };

    const mesesMax = (vino.Lote || [])
        .filter(l => (l as any).id_barrica)
        .map(l => computeMonths((l as any).fecha_embotellado))
        .reduce((acc, cur) => Math.max(acc, cur), 0);

    return {
        ...vino,
        meses_barrica: mesesMax,
    };
};

// RF01: Crear un nuevo registro de vino
export const createVino = async (data: CreateVinoData) => {
    const newId = generateUuid();
    data.id_vino = newId;
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
    } catch (error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            // Error si el registro no existe
            throw new Error('Vino no encontrado para actualizar.');
        }
        throw error;
    }
};