import { Prisma } from '@prisma/client';

// Tipos para viñedo
type VinedoCreateInput = Prisma.VinedoCreateInput;

export interface CreateVinedoData extends Omit<VinedoCreateInput, 'id_vinedo' | 'Cosecha'> {}

export interface UpdateVinedoData extends Partial<CreateVinedoData> {}

// Tipos para varietales

type VarietalCreateInput = Prisma.VarietalCreateInput;

export interface CreateVarietalData extends Omit<VarietalCreateInput, 'id_varietal' | 'Mezcla_Vino'> {}

export interface UpdateVarietalData extends Partial<CreateVarietalData> {}

// Tipos para barricas

type BarricaCreateInput = Prisma.BarricaCreateInput;

export interface BarricaCreationData extends Omit<BarricaCreateInput, 'id_barrica' | 'Lote' | 'Proceso_Produccion'> {
    // La fecha_compra debe venir como string o Date
    fecha_compra: string; 
    // cost debe venir como number (Prisma lo mapea a Decimal)
    costo: number; 
}

export interface BarricaUpdateData extends Partial<BarricaCreationData> {}

// Tipos para mezclas de vino

type Mezcla_VinoCreateInput = Prisma.Mezcla_VinoCreateInput;

export interface CreateMezclaVinoData extends Omit<Mezcla_VinoCreateInput, 'id_mezcla' | 'Vino' | 'Varietal'> {
    // Los IDs de Vino y Varietal deben ser strings (UUIDs)
    id_vino: string;
    id_varietal: string;
}

export interface UpdateMezclaVinoData extends Partial<CreateMezclaVinoData> {}