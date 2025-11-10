import { NextRequest, NextResponse } from 'next/server';

export const logout = async () => {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
        });

        if (!response.ok) {
            return NextResponse.json({ message: 'Error al cerrar sesión' }, { status: response.status });
        }

        if (response.status === 200) {
            window.location.href = '/';
            localStorage.removeItem("user");
            return NextResponse.json({ message: 'Sesión cerrada exitosamente' }, { status: 200 });
        }
        
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}