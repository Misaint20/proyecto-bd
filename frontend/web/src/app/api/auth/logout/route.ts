import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(req: NextRequest) {
    try {
        const response = NextResponse.json(
            { message: 'Sesión cerrada exitosamente' },
            { status: 200 }
        );

        // 2. Invalidar y eliminar la cookie 'access_token' (HttpOnly)
        // Se hace estableciendo el maxAge a 0 y una fecha de expiración pasada.
        const serializedToken = serialize('access_token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0, 
            path: '/',
            expires: new Date(0), 
        });

        // 3. Invalidar y eliminar la cookie 'user_role'
        const serializedRole = serialize('user_role', '', {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0, 
            path: '/',
            expires: new Date(0), 
        });

        // 4. Agregar los encabezados 'Set-Cookie' a la respuesta
        response.headers.set('Set-Cookie', serializedToken);
        response.headers.append('Set-Cookie', serializedRole);

        return response;

    } catch (error) {
        console.error('Error en el proxy de logout:', error);
        return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
    }
}