import { Request, Response, NextFunction } from 'express';
import * as VinoService from '../services/VinoService';
import { TipoVino } from '@prisma/client';
import { CreateVinoData } from '../types/vino';

// Obtener lista de Vinos
export const getVinos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vinos = await VinoService.findAllVinos();
        return res.status(200).json({ data: vinos });
    } catch (error) {
        // Pasa el error al middleware de Express
        next(error); 
    }
};

// Obtener Vino por ID
export const getVinoById = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    // Validación de ID
    if (!id) {
        return res.status(400).json({ message: 'El ID no puede ser nulo.' });
    }

    try {
        const vino = await VinoService.findVinoById(id);

        if (!vino) {
            return res.status(404).json({ message: 'Vino no encontrado.' });
        }
        return res.status(200).json({ data: vino });
    } catch (error) {
        next(error);
    }
};

// Crear un nuevo Vino
export const createVino = async (req: Request, res: Response, next: NextFunction) => {
    const data: CreateVinoData = req.body;
    
    // Validación de ENUM (TipoVino)
    const tiposValidos = Object.values(TipoVino);
    if (!tiposValidos.includes(data.tipo)) {
        return res.status(400).json({ message: `Tipo de vino inválido. Debe ser uno de: ${tiposValidos.join(', ')}` });
    }

    try {
        const nuevoVino = await VinoService.createVino(data);
        return res.status(201).json({ message: 'Vino creado exitosamente.', data: nuevoVino });
    } catch (error) {
        next(error);
    }
};

// Eliminar un Vino
export const deleteVino = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ message: 'El ID no puede ser nulo.' });
    }

    try {
        // Se valida que el vino exista antes de intentar eliminarlo (opcional, Prisma lo manejaría con un error)
        await VinoService.deleteVino(id);
        return res.status(200).json({ message: 'Vino eliminado exitosamente.' });
    } catch (error) {
        next(error);
    }
};