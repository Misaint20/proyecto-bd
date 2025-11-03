"use client"

import type React from "react"
import { useState } from "react"
import { X, Warehouse, Droplet, Calendar, DollarSign } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBarrica, updateBarrica } from "@/services/MastersService"

type BarricaModalProps = {
    open: boolean
    onClose: () => void
    barrica?: any
    onSuccess: () => void
}

export default function BarricaModal({ open, onClose, barrica, onSuccess }: BarricaModalProps) {
    const [formData, setFormData] = useState({
        tipo_madera: barrica?.tipo_madera || "",
        capacidad_litros: barrica?.capacidad_litros?.toString() || "",
        fecha_compra: barrica?.fecha_compra || "",
        costo: barrica?.costo?.toString() || "",
    })
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!formData.tipo_madera || !formData.capacidad_litros || !formData.fecha_compra || !formData.costo) {
            setError("Por favor, complete todos los campos obligatorios.")
            return
        }

        const dataToSend = {
            tipo_madera: formData.tipo_madera,
            capacidad_litros: Number.parseFloat(formData.capacidad_litros),
            fecha_compra: formData.fecha_compra,
            costo: Number.parseFloat(formData.costo),
        }

        const isUpdate = barrica !== null && barrica.id_barrica

        const serviceCall = isUpdate ? updateBarrica(barrica.id_barrica, dataToSend) : createBarrica(dataToSend)

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
                <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                                <Warehouse className="h-6 w-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold">{barrica ? "Editar Barrica" : "Nueva Barrica"}</h2>
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
                            <Warehouse className="w-4 h-4 text-amber-600" />
                            Tipo de Madera *
                        </label>
                        <Select
                            value={formData.tipo_madera}
                            onValueChange={(value) => setFormData({ ...formData, tipo_madera: value })}
                        >
                            <SelectTrigger className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-foreground">
                                <SelectValue placeholder="Selecciona el tipo de madera" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Frances">Francés</SelectItem>
                                <SelectItem value="Americano">Americano</SelectItem>
                                <SelectItem value="Mixto">Mixto</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                            <Droplet className="w-4 h-4 text-amber-600" />
                            Capacidad (Litros) *
                        </label>
                        <Select
                            value={formData.capacidad_litros}
                            onValueChange={(value) => setFormData({ ...formData, capacidad_litros: value })}
                        >
                            <SelectTrigger className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-foreground">
                                <SelectValue placeholder="Selecciona la capacidad" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="225">225L (Barrica Bordelesa)</SelectItem>
                                <SelectItem value="228">228L (Barrica Borgoña)</SelectItem>
                                <SelectItem value="300">300L</SelectItem>
                                <SelectItem value="500">500L</SelectItem>
                                <SelectItem value="600">600L</SelectItem>
                                <SelectItem value="1000">1000L</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-amber-600" />
                            Fecha de Compra *
                        </label>
                        <input
                            type="date"
                            required
                            value={formData.fecha_compra}
                            onChange={(e) => setFormData({ ...formData, fecha_compra: e.target.value })}
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-foreground"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-amber-600" />
                            Costo *
                        </label>
                        <input
                            type="number"
                            required
                            step="0.01"
                            min="0"
                            value={formData.costo}
                            onChange={(e) => setFormData({ ...formData, costo: e.target.value })}
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-foreground"
                            placeholder="Ej: 850.00"
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
                            className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all hover:scale-105 font-semibold shadow-lg"
                        >
                            {barrica ? "Actualizar" : "Crear"} Barrica
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
