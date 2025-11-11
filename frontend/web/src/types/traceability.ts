export interface Lote {
    id_lote: string;
    fecha_embotellado: string | Date;
    cantidad_botellas: number;
    numero_lote: string;
    Vino: {
        id_vino: string;
        nombre: string;
        precio_botella: string;
        tipo: string;
    };
    Barrica?: {
        id_barrica: string;
        tipo_madera: string;
    };
    Cosecha: {
        id_cosecha: string;
        nombre: string;
    };
}

export interface ControlCalidad {
    id_control: string;
    fecha_analisis: string | Date;
    tipo_control: string;
    resultados?: string | null;
    Proceso_Produccion: {
        id_proceso: string;
        nombre_proceso: string;
    }
}

export interface ProcesoProduccion {
    id_proceso: string;
    nombre_proceso: string;
    fecha_inicio: string | Date;
    fecha_fin?: string | Date | null;
    descripcion: string;
    Lote: {
        id_lote: string;
        numero_lote: string;
    };
}

export interface Cosecha {
    id_cosecha: string;
    anio: number;
    fecha_cosecha: string | Date;
    cantidad_kg: number;
    Vinedo: {
        id_vinedo: string;
        nombre: string;
    };
}