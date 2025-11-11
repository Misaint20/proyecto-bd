import { NextRequest, NextResponse } from "next/server";
import { getAuthHeaders } from "@/services/AuthHeaders";

const BACKEND_URL = process.env.BACKEND_URL;

interface Context {
    params: { id: string };
}

export const DELETE = async (req: NextRequest, { params }: Context) => {
    try {
        const { id } = await params;
        const response = await fetch(`${BACKEND_URL}/api/ventas/${id}`, {
            method: "DELETE",
            headers: await getAuthHeaders(req),
        });

        if (!response.ok) {
            return NextResponse.json({ message: "Error al eliminar venta" }, { status: response.status });
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: "Error al eliminar venta" }, { status: 500 });
    }
};