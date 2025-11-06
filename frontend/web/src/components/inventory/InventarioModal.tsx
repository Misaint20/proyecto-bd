"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Package, MapPin, Hash, Plus, Minus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createInventario, updateInventario } from "@/services/InventoryService"
import { getLotes } from "@/services/TraceabilityService"
import type { Lote } from "@/types/traceability"

type InventarioModalProps = {
    open: boolean
    onClose: () => void
    inventario?: any
    onSuccess: () => void
}

export default function InventarioModal({ open, onClose, inventario, onSuccess }: InventarioModalProps) {
    const [formData, setFormData] = useState({
        id_lote: inventario?.numero_lote || "",
        ubicacion: inventario?.ubicacion || "",
        cantidad_botellas: inventario?.cantidad_botellas?.toString() || "",
        tipo_operacion: "aumentar",
    })
    const [error, setError] = useState("")
    const [lotes, setLotes] = useState<Lote[]>([])

    useEffect(() => {
        async function fetchData() {
            const lotes = await getLotes()

            if (!lotes?.success) {
                console.error("Error al obtener datos de lotes:", lotes?.errorMessage)
            }

            setLotes(lotes?.data || [])
        }

        fetchData()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!formData.id_lote || !formData.ubicacion || !formData.cantidad_botellas) {
            setError("Por favor, complete todos los campos obligatorios.")
            return
        }

        let cantidadFinal = Number.parseInt(formData.cantidad_botellas)

        if (inventario && formData.tipo_operacion === "reducir") {
            cantidadFinal = -Math.abs(cantidadFinal)
        } else {
            cantidadFinal = Math.abs(cantidadFinal)
        }

        const dataToSend = {
            id_lote: formData.id_lote,
            ubicacion: formData.ubicacion,
            cantidad_botellas: cantidadFinal,
        }

        const isUpdate = inventario !== null && inventario.id_inventario

        const serviceCall = isUpdate ? updateInventario(inventario.id_inventario, dataToSend) : createInventario(dataToSend)

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
                <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                                <Package className="h-6 w-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold">{inventario ? "Editar Inventario" : "Nuevo Inventario"}</h2>
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
                            <Hash className="w-4 h-4 text-blue-600" />
                            Número de Lote *
                        </label>
                        <Select value={formData.id_lote} onValueChange={(value) => setFormData({ ...formData, id_lote: value })}>
                            <SelectTrigger className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-foreground font-mono">
                                <SelectValue placeholder="Selecciona el número de lote" />
                            </SelectTrigger>
                            <SelectContent>
                                {lotes.map((lote) => (
                                    <SelectItem key={lote.id_lote} value={lote.id_lote} className="font-mono">
                                        {lote.numero_lote}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            Ubicación *
                        </label>
                        <Select
                            value={formData.ubicacion}
                            onValueChange={(value) => setFormData({ ...formData, ubicacion: value })}
                        >
                            <SelectTrigger className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-foreground">
                                <SelectValue placeholder="Selecciona la ubicación" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Oficina">Oficina</SelectItem>
                                <SelectItem value="Bodega Secundaria">Bodega Secundaria</SelectItem>
                                <SelectItem value="Almacén Norte">Almacén Norte</SelectItem>
                                <SelectItem value="Almacén Sur">Almacén Sur</SelectItem>
                                <SelectItem value="Cava de Añejamiento">Cava de Añejamiento</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {inventario && (
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                                <Package className="w-4 h-4 text-blue-600" />
                                Tipo de Operación *
                            </label>
                            <Select
                                value={formData.tipo_operacion}
                                onValueChange={(value) => setFormData({ ...formData, tipo_operacion: value })}
                            >
                                <SelectTrigger className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-foreground">
                                    <SelectValue placeholder="Selecciona el tipo de operación" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="aumentar">
                                        <div className="flex items-center gap-2">
                                            <Plus className="w-4 h-4 text-green-600" />
                                            <span>Aumentar cantidad</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="reducir">
                                        <div className="flex items-center gap-2">
                                            <Minus className="w-4 h-4 text-red-600" />
                                            <span>Reducir cantidad</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                            <Package className="w-4 h-4 text-blue-600" />
                            Cantidad de Botellas *
                        </label>
                        <Select
                            value={formData.cantidad_botellas}
                            onValueChange={(value) => setFormData({ ...formData, cantidad_botellas: value })}
                        >
                            <SelectTrigger className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-foreground">
                                <SelectValue placeholder="Selecciona la cantidad" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">0 botellas</SelectItem>
                                <SelectItem value="100">100 botellas</SelectItem>
                                <SelectItem value="250">250 botellas</SelectItem>
                                <SelectItem value="500">500 botellas</SelectItem>
                                <SelectItem value="750">750 botellas</SelectItem>
                                <SelectItem value="1000">1,000 botellas</SelectItem>
                                <SelectItem value="1500">1,500 botellas</SelectItem>
                                <SelectItem value="2000">2,000 botellas</SelectItem>
                                <SelectItem value="2500">2,500 botellas</SelectItem>
                                <SelectItem value="3000">3,000 botellas</SelectItem>
                                <SelectItem value="5000">5,000 botellas</SelectItem>
                            </SelectContent>
                        </Select>
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
                            className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all hover:scale-105 font-semibold shadow-lg"
                        >
                            {inventario ? "Actualizar" : "Crear"} Inventario
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
