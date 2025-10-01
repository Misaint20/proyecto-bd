import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Genera un hash de contraseña para un usuario.
 * @param password Contraseña del usuario.
 * @returns {string} El hash de contraseña.
 */

export const hashPassword = (password: string): string => {
    return bcrypt.hashSync(password, SALT_ROUNDS);
};

/**
 * Verifica si una contraseña es correcta.
 * @param password Contraseña del usuario.
 * @param hash Hash de contraseña del usuario.
 * @returns {boolean} True si la contraseña es correcta, false en caso contrario.
 */

export const verifyPassword = (password: string, hash: string): boolean => {
    return bcrypt.compareSync(password, hash);
};