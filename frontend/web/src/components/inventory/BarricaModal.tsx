"use client"

import type React from "react"
import { Warehouse } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { Barrica } from "@/types/masters"
import { createBarrica, updateBarrica } from "@/services/MastersService"
import { BaseModal } from "@/components/ui/base-modal"
import { ErrorAlert } from "@/components/ui/error-alert"
import { useModalForm } from "@/hooks/useModalForm"

type BarricaModalProps = {
    open: boolean
    onClose: () => void
    barrica?: Barrica | null
    onSuccess: () => void
}

export default function BarricaModal({ open, onClose, barrica, onSuccess }: BarricaModalProps) {
    const { formData, setFormData, error, setError, loading, handleSubmit } = useModalForm<any>({
        isOpen: open,
        initialData: barrica ?? null,
        createFn: (data: any) => {
            const payload = {
                tipo_madera: (data as any).tipo_madera || "",
                capacidad_litros: Number.parseFloat((data as any).capacidad_litros) || 0,
                fecha_compra: (data as any).fecha_compra || "",
                costo: Number.parseFloat((data as any).costo) || 0,
            }
            return createBarrica(payload)
        },
        updateFn: (id: any, data: any) => {
            const payload = {
                tipo_madera: (data as any).tipo_madera || "",
                capacidad_litros: Number.parseFloat((data as any).capacidad_litros) || 0,
                fecha_compra: (data as any).fecha_compra || "",
                costo: Number.parseFloat((data as any).costo) || 0,
            }
            return updateBarrica(id, payload)
        },
        getId: (d: any) => (d as any)?.id_barrica ?? (d as any)?.id,
        onSuccess,
    })

    if (!open) return null

    const local = {
        tipo_madera: (formData as any)?.tipo_madera ?? "",
        capacidad_litros: (formData as any)?.capacidad_litros?.toString?.() ?? "",
        fecha_compra: (formData as any)?.fecha_compra ?? "",
        costo: (formData as any)?.costo?.toString?.() ?? "",
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        const validate = () => {
            if (!local.tipo_madera || !local.capacidad_litros || !local.fecha_compra || !local.costo) {
                setError("Por favor, complete todos los campos obligatorios.")
                return false
            }
            return true
        }

        const result = await handleSubmit(() => validate())
        if (result && (result as any).success) {
            onClose()
        }
    }

    return (
        <BaseModal
            isOpen={open}
            onClose={onClose}
            title={barrica ? "Editar Barrica" : "Nueva Barrica"}
            icon={<Warehouse className="h-6 w-6 text-white" />}
            gradientColors="from-amber-600 via-orange-600 to-red-600"
            maxWidth="max-w-2xl"
        >
            <form onSubmit={onSubmit} className="space-y-6">
                <ErrorAlert message={error} />

                <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                        <Warehouse className="w-4 h-4 text-amber-600" />
                        Tipo de Madera *
                    </label>
                    <Select
                        value={local.tipo_madera}
                        onValueChange={(value) => setFormData({ ...(formData ?? {}), tipo_madera: value })}
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
                    <label className="block text-sm font-semibold mb-2 text-foreground">Capacidad (litros) *</label>
                    <input
                        type="number"
                        required
                        step="0.01"
                        min="0"
                        value={local.capacidad_litros}
                        onChange={(e) => setFormData({ ...(formData ?? {}), capacidad_litros: e.target.value })}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-foreground"
                        placeholder="Ej: 225"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">Fecha de compra *</label>
                    <input
                        type="date"
                        required
                        value={local.fecha_compra}
                        onChange={(e) => setFormData({ ...(formData ?? {}), fecha_compra: e.target.value })}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-foreground"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">Costo *</label>
                    <input
                        type="number"
                        required
                        step="0.01"
                        min="0"
                        value={local.costo}
                        onChange={(e) => setFormData({ ...(formData ?? {}), costo: e.target.value })}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-foreground"
                        placeholder="Ej: 850.00"
                    />
                </div>

                <div className="flex gap-4">
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
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all hover:scale-105 font-semibold shadow-lg"
                    >
                        {barrica ? "Actualizar" : "Crear"} Barrica
                    </Button>
                </div>
            </form>
        </BaseModal>
    )
}
