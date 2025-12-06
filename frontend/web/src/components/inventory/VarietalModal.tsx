"use client"

import type React from "react"
import { useState } from "react"
import { X, Wine, FileText } from "lucide-react"
import { createVarietal, updateVarietal } from "@/services/MastersService"
import type { Varietal } from "@/types/masters"
import { BaseModal } from "@/components/ui/base-modal"
import { ErrorAlert } from "@/components/ui/error-alert"
import { Button } from "@/components/ui/button"

type VarietalModalProps = {
    open: boolean
    onClose: () => void
    varietal?: Varietal | null
    onSuccess: () => void
}

export default function VarietalModal({ open, onClose, varietal, onSuccess }: VarietalModalProps) {
    const [formData, setFormData] = useState({
        nombre: varietal?.nombre || "",
        descripcion: varietal?.descripcion || "",
    })
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (formData.nombre.trim() === "") {
            setError("Por favor, ingrese el nombre del varietal.")
            return
        }

        const varietalId = (varietal as any)?.id_varietal ?? (varietal as Varietal)?.id_varietal
        const isUpdate = !!varietalId

        const serviceCall = isUpdate ? updateVarietal(varietalId as string, formData) : createVarietal(formData)

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
        <BaseModal
            isOpen={open}
            onClose={onClose}
            title={varietal ? "Editar Varietal" : "Nuevo Varietal"}
            icon={<Wine className="h-6 w-6 text-white" />}
            gradientColors="from-purple-600 via-pink-600 to-rose-600"
            maxWidth="max-w-2xl"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <ErrorAlert message={error} />

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                            <Wine className="w-4 h-4 text-purple-600" />
                            Nombre del Varietal *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-foreground"
                            placeholder="Ej: Cabernet Sauvignon"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                            <FileText className="w-4 h-4 text-purple-600" />
                            Descripción
                        </label>
                        <textarea
                            value={formData.descripcion}
                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-foreground resize-none"
                            placeholder="Ej: Uva tinta de cuerpo completo con notas de frutas negras..."
                        />
                        <p className="text-xs text-muted-foreground mt-1.5 ml-1">Opcional</p>
                    </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all hover:scale-105 font-semibold shadow-lg"
                    >
                        {varietal ? "Actualizar" : "Crear"} Varietal
                    </Button>
                </div>
            </form>
        </BaseModal>
    )
}