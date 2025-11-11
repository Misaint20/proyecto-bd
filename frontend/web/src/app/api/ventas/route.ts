import { NextRequest, NextResponse } from "next/server";
import { getAuthHeaders } from "@/services/AuthHeaders";

const BACKEND_URL = process.env.BACKEND_URL;

export const GET = async (req: NextRequest) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/ventas`, {
            method: "GET",
            headers: await getAuthHeaders(req),
        });

        if (!response.ok) {
            return NextResponse.json({ message: "Error al obtener ventas" }, { status: response.status });
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: "Error al obtener ventas" }, { status: 500 });
    }
};

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const response = await fetch(`${BACKEND_URL}/api/ventas/registrar`, {
            method: "POST",
            headers: await getAuthHeaders(req),
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            return NextResponse.json({ message: "Error al crear venta" }, { status: response.status });
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: "Error al crear venta" }, { status: 500 });
    }
};