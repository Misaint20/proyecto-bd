export interface Lote {
    id_lote: string;
    fecha_embotellado: string | Date;
    cantidad_botellas: number;
    numero_lote: string;
    Vino: string;
    Barrica?: string | null;
    Cosecha: string;
}