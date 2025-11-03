"use client"

import type React from "react"
import { useState } from "react"
import { X, Grape, MapPin, User, Phone } from "lucide-react"
import { createVinedo, updateVinedo } from "@/services/MastersService"

type VinedoModalProps = {
    open: boolean
    onClose: () => void
    vinedo?: any
    onSuccess: () => void
}

export default function VinedoModal({ open, onClose, vinedo, onSuccess }: VinedoModalProps) {
    const [formData, setFormData] = useState({
        nombre: vinedo?.nombre || "",
        ubicacion: vinedo?.ubicacion || "",
        contacto: vinedo?.contacto || "",
        telefono: vinedo?.telefono || "",
    })
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (formData.nombre.trim() === "" || formData.ubicacion.trim() === "" || formData.contacto.trim() === "") {
            setError("Por favor, complete todos los campos obligatorios.")
            return
        }

        const isUpdate = vinedo !== null && vinedo.id_vinedo

        const serviceCall = isUpdate ? updateVinedo(vinedo.id_vinedo, formData) : createVinedo(formData)

        const result = await serviceCall

        if (result && result.success) {
            onSuccess()
            onClose()
        } else {
            setError(result?.errorMessage || "Ocurrió un error desconocido.")
        }
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                                <Grape className="h-6 w-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold">{vinedo ? "Editar Viñedo" : "Nuevo Viñedo"}</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-all hover:scale-110"
                        >
                            <X className="h-5 w-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Error display */}
                    {error && (
                        <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center gap-2">
                            <span className="font-semibold">Error:</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                            <Grape className="w-4 h-4 text-green-600" />
                            Nombre del Viñedo *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-foreground"
                            placeholder="Ej: Viñedo San José"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-green-600" />
                            Ubicación *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.ubicacion}
                            onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-foreground"
                            placeholder="Ej: Valle de Guadalupe, Baja California"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                            <User className="w-4 h-4 text-green-600" />
                            Persona de Contacto *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.contacto}
                            onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-foreground"
                            placeholder="Ej: Juan Pérez"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                            <Phone className="w-4 h-4 text-green-600" />
                            Teléfono
                        </label>
                        <input
                            type="tel"
                            value={formData.telefono}
                            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-foreground"
                            placeholder="Ej: 555-0101"
                        />
                        <p className="text-xs text-muted-foreground mt-1.5 ml-1">Opcional</p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border-2 border-border rounded-lg hover:bg-accent transition-all hover:scale-105 font-semibold text-foreground"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all hover:scale-105 font-semibold shadow-lg"
                        >
                            {vinedo ? "Actualizar" : "Crear"} Viñedo
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}