import { NextRequest, NextResponse } from 'next/server';
import { UserRole, ROLE_ROUTE_MAP } from '@/types/auth';

// Crear un array de rutas protegidas para el matcher
const PROTECTED_PATHS = Object.values(ROLE_ROUTE_MAP);

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get('access_token');
    const userRole = request.cookies.get('user_role')?.value as UserRole | undefined; // Obtener el rol

    // Rutas que requieren autenticación
    const isProtectedPath = PROTECTED_PATHS.some(path => pathname.startsWith(path));

    // 1. Si no hay token y no está en la página de login, redirigir a login
    if (!accessToken && pathname !== '/') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 2. Si el usuario ya está logueado e intenta ir a /login, redirigir a su dashboard
    if (accessToken && pathname === '/') {
        const dashboardPath = userRole ? ROLE_ROUTE_MAP[userRole] : '/';
        return NextResponse.redirect(new URL(dashboardPath, request.url));
    }

    // 3. Verificación de Rol para rutas protegidas
    if (accessToken && isProtectedPath) {

        // Si el rol es Administrador, permitir el acceso
        if (userRole === 'Administrador') {
            return NextResponse.next();
        }

        // Buscar el rol requerido para el path actual
        const requiredRoleEntry = Object.entries(ROLE_ROUTE_MAP).find(([role, path]) =>
            pathname.startsWith(path)
        );

        const requiredRole = requiredRoleEntry ? requiredRoleEntry[0] as UserRole : undefined;

        if (requiredRole && userRole !== requiredRole) {
            // Si el rol NO coincide, redirigir a una página de acceso denegado
            console.warn(`Acceso denegado: Usuario con rol ${userRole} intentó acceder a ${pathname}`);
            // Podrías redirigir a una página /unauthorized
            return NextResponse.redirect(new URL('/403', request.url));
        }
    }

    // Dejar pasar si es público o si pasa las verificaciones
    return NextResponse.next();
}

// Configuración para que el Middleware solo se ejecute en las rutas que nos interesan
export const config = {
    matcher: [
        /*
         * Rutas protegidas: /admin, /enologo, /bodeguero, /vendedor y todas sus subrutas.
         * También incluimos /login para redirigir a los ya logueados.
         */
        '/admin/:path*',
        '/enologo/:path*',
        '/bodeguero/:path*',
        '/vendedor/:path*',
        '/',
    ],
};