import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';
import { LoginResponse } from '@/types/auth';

// URL de tu backend local
const BACKEND_LOGIN_URL = `${process.env.BACKEND_URL}/api/auth/login`;

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();

        // 1. Llamada a tu backend
        const backendRes = await fetch(BACKEND_LOGIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!backendRes.ok) {
            // Manejo de errores del backend (e.g., credenciales inválidas)
            const errorData = await backendRes.json();
            return NextResponse.json(errorData, { status: backendRes.status });
        }

        // 2. Procesar la respuesta y establecer cookies
        const data: LoginResponse = await backendRes.json();
        const { access_token, user_info } = data;

        // Configuración de Cookies
        // Access Token (HttpOnly para máxima seguridad)
        const serializedToken = serialize('access_token', access_token, {
            httpOnly: true, // NO accesible por JavaScript en el navegador
            secure: process.env.NODE_ENV === 'production', // Solo en HTTPS en producción
            sameSite: 'strict', // Protección contra CSRF
            maxAge: 60 * 60 * 24, // 24 horas (ajusta según tu necesidad)
            path: '/',
        });

        // Rol del Usuario (No HttpOnly para que el Middleware y el cliente puedan leerlo)
        const serializedRole = serialize('user_role', user_info.role, {
            httpOnly: true, // Accesible por JS y Middleware
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24,
            path: '/',
        });



        // 3. Devolver respuesta con las cookies configuradas
        const response = NextResponse.json({ message: 'Autenticación exitosa', user: {nombre: user_info.username, role: user_info.role} }, { status: 200 });
        response.headers.set('Set-Cookie', serializedToken);
        response.headers.append('Set-Cookie', serializedRole); // Agregar la segunda cookie

        return response;

    } catch (error) {
        console.error('Error en el proxy de login:', error);
        return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
    }
}