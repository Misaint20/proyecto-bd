import { Prisma } from '@prisma/client';

type CosechaCreateInput = Prisma.CosechaCreateInput;

export interface CosechaCreationData extends Omit<CosechaCreateInput, 
    'id_cosecha' | 
    'Vinedo' | 
    'Lote' |
    'anio' 
> {
    id_vinedo: string; // FK al Viñedo
    // La fecha debe ser ISO 8601 (string)
    fecha_cosecha: string; 
}

export interface CosechaUpdateData extends Partial<CosechaCreationData> {}

// ----------------------------------------
// Tipos para Lote
// ----------------------------------------

type LoteCreateInput = Prisma.LoteCreateInput;

export interface LoteCreationData extends Omit<LoteCreateInput, 
    'id_lote' | 
    'Vino' | 
    'Barrica' | 
    'Cosecha' | 
    'Inventario' | 
    'Proceso_Produccion'
> {
    id_vino: string; // FK al Vino (producto final)
    id_cosecha: string; // FK a la Cosecha
    id_barrica?: string | null; // FK opcional a Barrica
    fecha_embotellado: string; 
}

export interface LoteUpdateData extends Partial<LoteCreationData> {}

// ----------------------------------------
// Tipos para Proceso_Produccion
// ----------------------------------------

type ProcesoProduccionCreateInput = Prisma.Proceso_ProduccionCreateInput;

export interface ProcesoProduccionCreationData extends Omit<ProcesoProduccionCreateInput, 
    'id_proceso' | 
    'Lote' | 
    'Barrica' | 
    'Control_Calidad'
> {
    id_lote: string; // FK al Lote
    id_barrica?: string | null; // FK opcional a Barrica
    fecha_inicio: string;
    fecha_fin?: string | null;
}

export interface ProcesoProduccionUpdateData extends Partial<ProcesoProduccionCreationData> {}

// ----------------------------------------
// Tipos para Control_Calidad
// ----------------------------------------

type ControlCalidadCreateInput = Prisma.Control_CalidadCreateInput;

export interface ControlCalidadCreationData extends Omit<ControlCalidadCreateInput, 
    'id_control' | 
    'Proceso_Produccion'
> {
    id_proceso: string; // FK al Proceso de Producción
    fecha_analisis: string;
}

export interface ControlCalidadUpdateData extends Partial<ControlCalidadCreationData> {}