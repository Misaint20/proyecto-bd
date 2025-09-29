import { Request, Response, NextFunction } from "express";

export class HttpError extends Error {
    status: number;

    constructor(message: string, status: number = 500) {
        super(message);
        this.status = status;
        this.name = "HttpError";
    }
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(`Tipo: ${err.name} - Ruta: ${req.originalUrl} - Mensaje: ${err.message}`);

    if (err instanceof HttpError) {
        return res.status(err.status).json({
            message: err.message,
        });
    }

    if (err.code === "P2025") {
        return res.status(404).json({
            message: "Recurso no encontrado o no existe",
        });
    }

    return res.status(500).json({
        message: "Error interno del servidor",

        error: process.env.NODE_ENV === "development" ? err.message: undefined,
    });

}