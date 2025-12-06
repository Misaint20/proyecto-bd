"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Package, MapPin, Hash, Plus, Minus } from "lucide-react"
import { BaseModal } from "@/components/ui/base-modal"
import { ErrorAlert } from "@/components/ui/error-alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createInventario, updateInventario } from "@/services/InventoryService"
import { getLotes } from "@/services/TraceabilityService"
import { fetchData } from "@/lib/fetchData"
import type { Lote } from "@/types/traceability"
import type { Inventario } from "@/types/inventory"
import { useModalForm } from "@/hooks/useModalForm"

type InventarioModalProps = {
    open: boolean
    onClose: () => void
    inventario?: Partial<Inventario> | null
    onSuccess: () => void
}

export default function InventarioModal({ open, onClose, inventario, onSuccess }: InventarioModalProps) {
    const [lotes, setLotes] = useState<Lote[]>([])

    const { formData, setFormData, error, setError, loading, handleSubmit } = useModalForm<Partial<Inventario>>({
        isOpen: open,
        initialData: inventario ?? null,
        createFn: (data: any) => {
            const cantidadFinal = Math.abs(Number.parseInt((data as any).cantidad_botellas)) || 0
            const payload = {
                id_lote: (data as any).id_lote,
                ubicacion: (data as any).ubicacion,
                cantidad_botellas: cantidadFinal,
            }
            return createInventario(payload)
        },
        updateFn: (id: any, data: any) => {
            let cantidadFinal = Number.parseInt((data as any).cantidad_botellas) || 0
            if ((data as any).tipo_operacion === "reducir") cantidadFinal = -Math.abs(cantidadFinal)
            else cantidadFinal = Math.abs(cantidadFinal)
            const payload = {
                id_lote: (data as any).id_lote,
                ubicacion: (data as any).ubicacion,
                cantidad_botellas: cantidadFinal,
            }
            return updateInventario(id, payload)
        },
        getId: (d: any) => (d as any)?.id_inventario ?? (d as any)?.id,
        onSuccess,
    })

    useEffect(() => {
        fetchData(getLotes, setLotes, "lotes")
    }, [])

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        const validate = () => {
            if (!formData || !((formData as any).id_lote) || !((formData as any).ubicacion) || !((formData as any).cantidad_botellas)) {
                setError("Por favor, complete todos los campos obligatorios.")
                return false
            }
            return true
        }

        // Normalize cantidad
        const cantidadFinal = Number.parseInt((formData as any).cantidad_botellas)
        const payload = {
            id_lote: (formData as any).id_lote,
            ubicacion: (formData as any).ubicacion,
            cantidad_botellas: cantidadFinal,
        }

        const result = await handleSubmit(() => validate())
        // `useModalForm` calls onSuccess already; close modal on success
        if (result && (result as any).success) {
            onClose()
        }
    }

    if (!open) return null

    return (
        <BaseModal
            isOpen={open}
            onClose={onClose}
            title={inventario ? "Editar Inventario" : "Nuevo Inventario"}
            icon={<Package className="h-6 w-6 text-white" />}
            gradientColors="from-blue-600 via-cyan-600 to-teal-600"
            maxWidth="max-w-2xl"
        >
            <form onSubmit={onSubmit} className="space-y-6">
                <ErrorAlert message={error} />

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                            <Hash className="w-4 h-4 text-blue-600" />
                            Número de Lote *
                        </label>
                        <Select value={(formData as any)?.id_lote ?? ""} onValueChange={(value) => setFormData({ ...(formData as any), id_lote: value })}>
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
                            value={(formData as any)?.ubicacion ?? ""}
                            onValueChange={(value) => setFormData({ ...(formData as any), ubicacion: value })}
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
                                value={(formData as any)?.tipo_operacion ?? "aumentar"}
                                onValueChange={(value) => setFormData({ ...(formData as any), tipo_operacion: value })}
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
                        <input
                            type="number"
                            min="0"
                            value={(formData as any)?.cantidad_botellas ?? ""}
                            onChange={(e) => setFormData({ ...(formData as any), cantidad_botellas: e.target.value })}
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-foreground"
                            placeholder="Ej: 1000"
                            required
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
                        className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all hover:scale-105 font-semibold shadow-lg"
                    >
                        {inventario ? "Actualizar" : "Crear"} Inventario
                    </button>
                </div>
            </form>
        </BaseModal>
    )
}
