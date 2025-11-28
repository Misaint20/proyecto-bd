import { NextRequest, NextResponse } from 'next/server';
import { UserRole, ROLE_ROUTE_MAP } from '@/types/auth';

// Crear un array de rutas protegidas para el matcher
const PROTECTED_PATHS = Object.values(ROLE_ROUTE_MAP);

function parseJwt(token: string) {
    try {
        const parts = token.split('.')
        if (parts.length !== 3) return null
        const payload = parts[1]
        const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
        try {
            return JSON.parse(decodeURIComponent(escape(decoded)))
        } catch (_) {
            return JSON.parse(decoded)
        }
    } catch (err) {
        return null
    }
}

async function verifyJwt(token: string) {
    // Intenta verificar la firma con `jose` si está instalada y hay configuración
    try {
        const jose = await import('jose')
        const { jwtVerify, createRemoteJWKSet } = jose as any

        if (process.env.JWT_SECRET) {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET)
            const verified = await jwtVerify(token, secret)
            return verified.payload
        }

        if (process.env.JWKS_URI) {
            const jwks = createRemoteJWKSet(new URL(process.env.JWKS_URI))
            const verified = await jwtVerify(token, jwks)
            return verified.payload
        }
    } catch (err) {
        // jose no disponible o verificación falló; haremos fallback a decodificación
        // console.warn('JWT verification not performed or failed:', err)
    }

    return null
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get('access_token')?.value;
    const cookieRole = request.cookies.get('user_role')?.value as UserRole | undefined; // fallback

    // Rutas que requieren autenticación
    const isProtectedPath = PROTECTED_PATHS.some(path => pathname.startsWith(path));

    // 1. Si no hay token y no está en la página de login, redirigir a login
    if (!accessToken && pathname !== '/') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 2. Si el usuario ya está logueado e intenta ir a / (login), redirigir a su dashboard
    if (accessToken && pathname === '/') {
        // intentaremos verificar el token y extraer rol; si no se puede, decodificamos sin verificar
        const verified = await verifyJwt(accessToken)
        const parsed = verified ?? parseJwt(accessToken)
        const roleFromToken = parsed?.role || parsed?.rol || parsed?.user_role
        const dashboardPath = (roleFromToken as UserRole) ? ROLE_ROUTE_MAP[roleFromToken as UserRole] : (cookieRole ? ROLE_ROUTE_MAP[cookieRole] : '/')
        return NextResponse.redirect(new URL(dashboardPath || '/', request.url));
    }

    // 3. Verificación de Rol para rutas protegidas
    if (accessToken && isProtectedPath) {
        // Intentar verificar firma; si no, decodificar para fallback
        const verified = await verifyJwt(accessToken)
        const parsed = verified ?? parseJwt(accessToken)

        // Validar expiración si viene en el token (exp en segundos)
        const exp = parsed?.exp
        if (exp && typeof exp === 'number') {
            const now = Math.floor(Date.now() / 1000)
            if (now >= exp) {
                // token expirado: borrar cookie de acceso y redirigir a login
                const res = NextResponse.redirect(new URL('/', request.url))
                res.cookies.set('access_token', '', { maxAge: 0 })
                res.cookies.set('user_role', '', { maxAge: 0 })
                return res
            }
        }

        // Preferir rol embebido en la verificación/decodificación en lugar de la cookie
        const roleFromToken = parsed?.role || parsed?.rol || parsed?.user_role
        const userRole = (roleFromToken as UserRole) || cookieRole

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
         * También incluimos / (login) para redirigir a los ya logueados.
         */
        '/admin/:path*',
        '/enologo/:path*',
        '/bodeguero/:path*',
        '/vendedor/:path*',
        '/',
    ],
};