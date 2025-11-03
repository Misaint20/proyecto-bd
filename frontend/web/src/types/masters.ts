export interface Vinedo {
    id_vinedo: string;
    nombre: string;
    ubicacion: string;
    contacto: string;
    telefono?: string | null | undefined;
}

export interface Varietal {
    id_varietal: string;
    nombre: string;
    descripcion?: string | null | undefined;
}

export interface Barrica {
    id_barrica: string;
    tipo_madera: string;
    capacidad_litros: number;
    fecha_compra: Date | string;
    costo: number | string;
}

export interface MezclaVino {
    id_mezcla: string;
    porcentaje: string | number;
    Vino: {
        id_vino: string;
        nombre: string;
    };
    Varietal: {
        id_varietal: string;
        nombre: string;
    };
}