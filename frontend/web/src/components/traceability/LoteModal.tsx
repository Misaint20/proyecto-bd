"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Package, Wine, Calendar, Droplet, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BaseModal } from "@/components/ui/base-modal"
import { ErrorAlert } from "@/components/ui/error-alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createLote, getCosechas, updateLote } from "@/services/TraceabilityService"
import { useModalForm } from "@/hooks/useModalForm"
import type { Lote, Cosecha } from "@/types/traceability"
import type { Vino } from "@/types/vino"
import type { Barrica } from "@/types/masters"
import { getVinos } from "@/services/VinosService"
import { getBarricas } from "@/services/MastersService"

interface LoteModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    lote?:
        | Lote
        | {
              id_lote?: string
              id_vino?: string
              id_cosecha?: string
              id_barrica?: string
              numero_lote?: string
              cantidad_botellas?: number
              fecha_embotellado?: string
          }
        | null
}

export default function LoteModal({ isOpen, onClose, onSuccess, lote }: LoteModalProps) {
    const [vinosData, setVinosData] = useState<Vino[]>([])
    const [cosechasData, setCosechasData] = useState<Cosecha[]>([])
    const [barricasData, setBarricasData] = useState<Barrica[]>([])

    const { formData, setFormData, error, setError, loading, handleSubmit } = useModalForm<any>({
        isOpen,
        initialData: lote ?? null,
        createFn: (data: any) => {
            const payload = {
                ...data,
                cantidad_botellas: Number.parseInt((data as any).cantidad_botellas) || 0,
                id_barrica: (data as any).id_barrica === "none" ? undefined : (data as any).id_barrica || undefined,
            }
            return createLote(payload)
        },
        updateFn: (id: any, data: any) => {
            const payload = {
                ...data,
                cantidad_botellas: Number.parseInt((data as any).cantidad_botellas) || 0,
                id_barrica: (data as any).id_barrica === "none" ? undefined : (data as any).id_barrica || undefined,
            }
            return updateLote(id, payload)
        },
        getId: (d: any) => (d as any)?.id_lote ?? (d as Lote)?.id_lote,
        onSuccess,
    })

    useEffect(() => {
        if (isOpen) {
            loadData()
            // `useModalForm` will reset initialData when isOpen changes, but ensure nested fields map if server returns different shapes
            if (lote && setFormData) {
                setFormData({
                    id_vino: (lote as any)?.id_vino ?? (lote as Lote)?.Vino?.id_vino ?? "",
                    id_cosecha: (lote as any)?.id_cosecha ?? (lote as Lote)?.Cosecha?.id_cosecha ?? "",
                    id_barrica: (lote as any)?.id_barrica ?? (lote as Lote)?.Barrica?.id_barrica ?? "",
                    numero_lote: (lote as any)?.numero_lote ?? (lote as Lote)?.numero_lote ?? "",
                    cantidad_botellas: ((lote as any)?.cantidad_botellas ?? (lote as Lote)?.cantidad_botellas)?.toString() || "",
                    fecha_embotellado: (lote as any)?.fecha_embotellado
                        ? new Date((lote as any).fecha_embotellado).toISOString().split("T")[0]
                        : (lote as Lote)?.fecha_embotellado
                        ? new Date((lote as Lote).fecha_embotellado).toISOString().split("T")[0]
                        : new Date().toISOString().split("T")[0],
                })
            }
            setError("")
        }
    }, [isOpen, lote])

    const loadData = async () => {
        try {
            const [vinosData, cosechasData, barricasData] = await Promise.all([getVinos(), getCosechas(), getBarricas()])
            setVinosData(vinosData?.data)
            setCosechasData(cosechasData?.data)
            setBarricasData(barricasData?.data)
        } catch (err) {
            console.error("Error loading data:", err)
        }
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        const validate = () => {
            if (!formData || !((formData as any).id_vino) || !((formData as any).id_cosecha) || !((formData as any).numero_lote) || !((formData as any).cantidad_botellas)) {
                setError("Por favor completa todos los campos obligatorios")
                return false
            }
            return true
        }

        const result = await handleSubmit(() => validate())
        if (result && (result as any).success) {
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={lote ? "Editar Lote" : "Nuevo Lote"}
            subtitle={lote ? "Actualiza los datos del lote" : "Registra un nuevo lote"}
            icon={<Package className="h-6 w-6 text-white" />}
            gradientColors="from-blue-600 to-cyan-600"
        >
            <form onSubmit={onSubmit} className="space-y-6">
                <ErrorAlert message={error} />

                {/* Número de Lote */}
                <div className="space-y-2">
                    <Label htmlFor="numero_lote" className="flex items-center gap-2 text-foreground font-semibold">
                        <Hash className="h-4 w-4 text-blue-600" />
                        Número de Lote *
                    </Label>
                    <Input
                        id="numero_lote"
                        value={formData.numero_lote}
                        onChange={(e) => setFormData({ ...formData, numero_lote: e.target.value })}
                        className="border-2 focus:border-blue-500"
                        placeholder="Ej: LOTE-2024-001"
                        required
                    />
                </div>

                {/* Vino */}
                <div className="space-y-2">
                    <Label htmlFor="id_vino" className="flex items-center gap-2 text-foreground font-semibold">
                        <Wine className="h-4 w-4 text-blue-600" />
                        Vino *
                    </Label>
                    <Select value={formData.id_vino} onValueChange={(value) => setFormData({ ...formData, id_vino: value })}>
                        <SelectTrigger className="border-2 focus:border-blue-500">
                            <SelectValue placeholder="Selecciona un vino" />
                        </SelectTrigger>
                        <SelectContent>
                            {vinosData.map((vino) => (
                                <SelectItem key={vino.id_vino} value={vino.id_vino}>
                                    {vino.nombre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Cosecha */}
                <div className="space-y-2">
                    <Label htmlFor="id_cosecha" className="flex items-center gap-2 text-foreground font-semibold">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        Cosecha *
                    </Label>
                    <Select
                        value={formData.id_cosecha}
                        onValueChange={(value) => setFormData({ ...formData, id_cosecha: value })}
                    >
                        <SelectTrigger className="border-2 focus:border-blue-500">
                            <SelectValue placeholder="Selecciona una cosecha" />
                        </SelectTrigger>
                        <SelectContent>
                            {cosechasData.map((cosecha) => (
                                <SelectItem key={cosecha.id_cosecha} value={cosecha.id_cosecha}>
                                    {cosecha.anio} - {cosecha.Vinedo?.nombre || "Sin viñedo"}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Barrica (Opcional) */}
                <div className="space-y-2">
                    <Label htmlFor="id_barrica" className="flex items-center gap-2 text-foreground font-semibold">
                        <Droplet className="h-4 w-4 text-blue-600" />
                        Barrica (Opcional)
                    </Label>
                    <Select
                        value={formData.id_barrica}
                        onValueChange={(value) => setFormData({ ...formData, id_barrica: value })}
                    >
                        <SelectTrigger className="border-2 focus:border-blue-500">
                            <SelectValue placeholder="Selecciona una barrica" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Sin barrica</SelectItem>
                            {barricasData.map((barrica) => (
                                <SelectItem key={barrica.id_barrica} value={barrica.id_barrica}>
                                    {barrica.tipo_madera} - {barrica.capacidad_litros}L
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Cantidad de Botellas */}
                <div className="space-y-2">
                    <Label htmlFor="cantidad_botellas" className="flex items-center gap-2 text-foreground font-semibold">
                        <Package className="h-4 w-4 text-blue-600" />
                        Cantidad de Botellas *
                    </Label>
                    <Input
                        id="cantidad_botellas"
                        type="number"
                        min="0"
                        value={formData.cantidad_botellas}
                        onChange={(e) => setFormData({ ...formData, cantidad_botellas: e.target.value })}
                        className="border-2 focus:border-blue-500"
                        placeholder="Ej: 1000"
                        required
                    />
                </div>

                {/* Fecha Embotellado */}
                <div className="space-y-2">
                    <Label htmlFor="fecha_embotellado" className="flex items-center gap-2 text-foreground font-semibold">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        Fecha de Embotellado *
                    </Label>
                    <Input
                        id="fecha_embotellado"
                        type="date"
                        value={formData.fecha_embotellado}
                        onChange={(e) => setFormData({ ...formData, fecha_embotellado: e.target.value })}
                        className="border-2 focus:border-blue-500"
                        required
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onClose} className="flex-1 border-2 bg-transparent">
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg"
                    >
                        {lote ? "Actualizar" : "Crear"} Lote
                    </Button>
                </div>
            </form>
        </BaseModal>
    )
}
