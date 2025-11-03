"use client"

import type React from "react"
import { useState } from "react"
import { X, Wine, FileText } from "lucide-react"
import { createVarietal, updateVarietal } from "@/services/MastersService"

type VarietalModalProps = {
    open: boolean
    onClose: () => void
    varietal?: any
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

        const isUpdate = varietal !== null && varietal.id_varietal

        const serviceCall = isUpdate ? updateVarietal(varietal.id_varietal, formData) : createVarietal(formData)

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
                <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                                <Wine className="h-6 w-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold">{varietal ? "Editar Varietal" : "Nuevo Varietal"}</h2>
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
                    {error && (
                        <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center gap-2">
                            <span className="font-semibold">Error:</span>
                            <span>{error}</span>
                        </div>
                    )}

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
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border-2 border-border rounded-lg hover:bg-accent transition-all hover:scale-105 font-semibold text-foreground"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all hover:scale-105 font-semibold shadow-lg"
                        >
                            {varietal ? "Actualizar" : "Crear"} Varietal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}