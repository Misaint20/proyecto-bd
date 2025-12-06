"use client"

import type React from "react"
import { useState } from "react"
import { X, Grape, MapPin, User, Phone } from "lucide-react"
import { createVinedo, updateVinedo } from "@/services/MastersService"
import type { Vinedo } from "@/types/masters"
import { useModalForm } from "@/hooks/useModalForm"
import { BaseModal } from "@/components/ui/base-modal"
import { ErrorAlert } from "@/components/ui/error-alert"

type VinedoModalProps = {
    open: boolean
    onClose: () => void
    vinedo?: Vinedo | null
    onSuccess: () => void
}

export default function VinedoModal({ open, onClose, vinedo, onSuccess }: VinedoModalProps) {
    const { formData, setFormData, error, setError, loading, handleSubmit } = useModalForm<any>({
        isOpen: open,
        initialData: vinedo ?? null,
        createFn: (data: any) => createVinedo(data),
        updateFn: (id: any, data: any) => updateVinedo(id, data),
        getId: (d: any) => (d as any)?.id_vinedo ?? (d as any)?.id,
        onSuccess,
    })

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        const validate = () => {
            if (!formData || !((formData as any).nombre?.trim()) || !((formData as any).ubicacion?.trim()) || !((formData as any).contacto?.trim())) {
                setError("Por favor, complete todos los campos obligatorios.")
                return false
            }
            return true
        }

        const result = await handleSubmit(() => validate())
        if (result && (result as any).success) onClose()
    }

    if (!open) return null

    return (
        <BaseModal
            isOpen={open}
            onClose={onClose}
            title={vinedo ? "Editar Viñedo" : "Nuevo Viñedo"}
            icon={<Grape className="h-6 w-6 text-white" />}
            gradientColors="from-green-600 via-emerald-600 to-teal-600"
            maxWidth="max-w-2xl"
        >
            <form onSubmit={onSubmit} className="space-y-6">
                <ErrorAlert message={error} />

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                            <Grape className="w-4 h-4 text-green-600" />
                            Nombre del Viñedo *
                        </label>
                        <input
                            type="text"
                            required
                            value={(formData as any)?.nombre ?? ""}
                            onChange={(e) => setFormData({ ...(formData ?? {}), nombre: e.target.value })}
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
                            value={(formData as any)?.ubicacion ?? ""}
                            onChange={(e) => setFormData({ ...(formData ?? {}), ubicacion: e.target.value })}
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
                            value={(formData as any)?.contacto ?? ""}
                            onChange={(e) => setFormData({ ...(formData ?? {}), contacto: e.target.value })}
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
                            value={(formData as any)?.telefono ?? ""}
                            onChange={(e) => setFormData({ ...(formData ?? {}), telefono: e.target.value })}
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
        </BaseModal>
    )
}