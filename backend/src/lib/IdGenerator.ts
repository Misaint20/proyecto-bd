import { v4 as uuidv4, validate as validateUuid } from 'uuid';

/**
 * Genera un UUID v4 (Identificador Universal Único, versión 4).
 * @returns {string} El ID UUID v4.
 */
export const generateUuid = (): string => {
    // Genera un string de 36 caracteres (incluyendo guiones)
    return uuidv4();
};

/**
 * Valida si un string es un UUID bien formado (v4).
 * @param id 
 * @returns {boolean}
 */
export const isValidUuid = (id: string): boolean => {
    return validateUuid(id);
};