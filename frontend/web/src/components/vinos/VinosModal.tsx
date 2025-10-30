"use client"

import type React from "react"

import { useState } from "react"
import type { Vino } from "@/types/vino"
import { createVino, updateVino } from "@/services/VinosService"
import { Wine, Calendar, DollarSign, Package, Clock, FileText, X } from "lucide-react"

export default function VinoModal({
    vino,
    onClose,
    onSuccess,
}: {
    vino: Vino | null
    onClose: () => void
    onSuccess: () => void
}) {
    const tiposVino = ["Tinto", "Blanco", "Rosado", "Espumoso"]

    const [formData, setFormData] = useState({
        nombre: vino?.nombre || "",
        tipo: vino?.tipo || tiposVino[0],
        anio_cosecha: vino?.anio_cosecha || new Date().getFullYear(),
        precio_botella: vino?.precio_botella || 0,
        botellas_por_caja: vino?.botellas_por_caja || 12,
        meses_barrica: vino?.meses_barrica || 0,
        descripcion: vino?.descripcion || "",
    })
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (formData.nombre.trim() === "" || formData.precio_botella <= 0) {
            setError("Por favor, complete todos los campos obligatorios.")
            return
        }

        const isUpdate = vino !== null && vino.id_vino

        const serviceCall = isUpdate ? updateVino(vino.id_vino, formData) : createVino(formData)

        const result = await serviceCall

        if (result && result.success) {
            onSuccess()
        } else {
            setError(result?.errorMessage || "Ocurrió un error desconocido.")
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                                <Wine className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">{vino ? "Editar Vino" : "Nuevo Vino"}</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-all hover:scale-110"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center gap-2">
                            <span className="font-semibold">Error:</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                                <Wine className="w-4 h-4 text-green-600" />
                                Nombre *
                            </label>
                            <input
                                type="text"
                                required
                                maxLength={100}
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-foreground"
                                placeholder="Ej: Reserva Especial"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                                <Wine className="w-4 h-4 text-green-600" />
                                Tipo *
                            </label>
                            <select
                                required
                                value={formData.tipo}
                                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-foreground"
                            >
                                {tiposVino.map((tipo) => (
                                    <option key={tipo} value={tipo}>
                                        {tipo}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-green-600" />
                                Año de Cosecha *
                            </label>
                            <input
                                type="number"
                                required
                                min="1900"
                                max="2100"
                                value={formData.anio_cosecha}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        anio_cosecha: Number.parseInt(e.target.value) || new Date().getFullYear(),
                                    })
                                }
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-foreground"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-green-600" />
                                Precio por Botella *
                            </label>
                            <input
                                type="number"
                                required
                                step="0.01"
                                min="0"
                                value={formData.precio_botella}
                                onChange={(e) => setFormData({ ...formData, precio_botella: Number.parseFloat(e.target.value) || 0 })}
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-foreground"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                                <Package className="w-4 h-4 text-green-600" />
                                Botellas por Caja
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.botellas_por_caja}
                                onChange={(e) => setFormData({ ...formData, botellas_por_caja: Number.parseInt(e.target.value) || 12 })}
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-foreground"
                            />
                            <p className="text-xs text-muted-foreground mt-1.5 ml-1">Por defecto: 12 botellas</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                                <Clock className="w-4 h-4 text-green-600" />
                                Meses en Barrica
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.meses_barrica}
                                onChange={(e) => setFormData({ ...formData, meses_barrica: Number.parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-foreground"
                            />
                            <p className="text-xs text-muted-foreground mt-1.5 ml-1">Por defecto: 0 meses</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                            <FileText className="w-4 h-4 text-green-600" />
                            Descripción
                        </label>
                        <textarea
                            value={formData.descripcion}
                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-foreground resize-none"
                            placeholder="Describe las características del vino..."
                        />
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
                            {vino ? "Actualizar" : "Crear"} Vino
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
