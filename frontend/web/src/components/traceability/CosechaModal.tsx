"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Grape, MapPin, Calendar, Weight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BaseModal } from "@/components/ui/base-modal"
import { ErrorAlert } from "@/components/ui/error-alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getVinedos } from "@/services/MastersService"
import { createCosecha, updateCosecha } from "@/services/TraceabilityService"
import type { Cosecha } from "@/types/traceability"
import type { Vinedo } from "@/types/masters"

interface CosechaModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    cosecha?: Cosecha | null
}

export default function CosechaModal({ isOpen, onClose, onSuccess, cosecha }: CosechaModalProps) {
    const [formData, setFormData] = useState({
        id_vinedo: "",
        anio: new Date().getFullYear(),
        cantidad_kg: "",
        fecha_cosecha: new Date().toISOString().split("T")[0],
    })
    const [error, setError] = useState("")
    const [vinedos, setVinedos] = useState<Vinedo[]>([])

    const mockVinedos = async () => {
                await getVinedos().then((result) => {
                    if (result && result.success) {
                        setVinedos(result.data)
                    } else if (result) {
                        console.error(`Error al obtener vinedos: ${result.errorMessage}`)
                    }
                })
            }

    useEffect(() => {
        if (isOpen) {
            mockVinedos()
            if (cosecha) {
                setFormData({
                    id_vinedo: (cosecha as any)?.id_vinedo ?? cosecha.Vinedo?.id_vinedo ?? "",
                    anio: cosecha.anio || new Date().getFullYear(),
                    cantidad_kg: cosecha.cantidad_kg?.toString() || "",
                    fecha_cosecha: cosecha.fecha_cosecha
                        ? new Date(cosecha.fecha_cosecha).toISOString().split("T")[0]
                        : new Date().toISOString().split("T")[0],
                })
            } else {
                setFormData({
                    id_vinedo: "",
                    anio: new Date().getFullYear(),
                    cantidad_kg: "",
                    fecha_cosecha: new Date().toISOString().split("T")[0],
                })
            }
            setError("")
        }
    }, [isOpen, cosecha])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!formData.id_vinedo || !formData.cantidad_kg) {
            setError("Por favor completa todos los campos obligatorios")
            return
        }

        const cosechaId = (cosecha as any)?.id_cosecha ?? cosecha?.id_cosecha
        const isUpdate = !!cosechaId

        const dataToSend = {
            ...formData,
            cantidad_kg: Number.parseInt(formData.cantidad_kg),
        }

        const result = isUpdate ? await updateCosecha(cosechaId as string, dataToSend) : await createCosecha(dataToSend)

        if (result && result.success) {
            onSuccess()
            onClose()
        } else {
            setError(result?.errorMessage || "Ocurrió un error desconocido.")
        }
    }

    if (!isOpen) return null

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={cosecha ? "Editar Cosecha" : "Nueva Cosecha"}
            subtitle={cosecha ? "Actualiza los datos de la cosecha" : "Registra una nueva cosecha"}
            icon={<Grape className="h-6 w-6 text-white" />}
            gradientColors="from-purple-600 to-pink-600"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <ErrorAlert message={error} />

                {/* Viñedo */}
                <div className="space-y-2">
                    <Label htmlFor="id_vinedo" className="flex items-center gap-2 text-foreground font-semibold">
                        <MapPin className="h-4 w-4 text-purple-600" />
                        Viñedo *
                    </Label>
                    <Select
                        value={formData.id_vinedo}
                        onValueChange={(value) => setFormData({ ...formData, id_vinedo: value })}
                    >
                        <SelectTrigger className="border-2 focus:border-purple-500">
                            <SelectValue placeholder="Selecciona un viñedo" />
                        </SelectTrigger>
                        <SelectContent>
                            {vinedos.map((vinedo) => (
                                <SelectItem key={vinedo.id_vinedo} value={vinedo.id_vinedo}>
                                    {vinedo.nombre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Año */}
                <div className="space-y-2">
                    <Label htmlFor="anio" className="flex items-center gap-2 text-foreground font-semibold">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        Año *
                    </Label>
                    <Select
                        value={formData.anio.toString()}
                        onValueChange={(value) => setFormData({ ...formData, anio: Number.parseInt(value) })}
                    >
                        <SelectTrigger className="border-2 focus:border-purple-500">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Cantidad (kg) */}
                <div className="space-y-2">
                    <Label htmlFor="cantidad_kg" className="flex items-center gap-2 text-foreground font-semibold">
                        <Weight className="h-4 w-4 text-purple-600" />
                        Cantidad (kg) *
                    </Label>
                    <Input
                        id="cantidad_kg"
                        type="number"
                        step="0.01"
                        value={formData.cantidad_kg}
                        onChange={(e) => setFormData({ ...formData, cantidad_kg: e.target.value })}
                        className="border-2 focus:border-purple-500"
                        placeholder="Ej: 5000"
                        required
                    />
                </div>

                {/* Fecha Cosecha */}
                <div className="space-y-2">
                    <Label htmlFor="fecha_cosecha" className="flex items-center gap-2 text-foreground font-semibold">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        Fecha de Cosecha *
                    </Label>
                    <Input
                        id="fecha_cosecha"
                        type="date"
                        value={formData.fecha_cosecha}
                        onChange={(e) => setFormData({ ...formData, fecha_cosecha: e.target.value })}
                        className="border-2 focus:border-purple-500"
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
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                    >
                        {cosecha ? "Actualizar" : "Crear"} Cosecha
                    </Button>
                </div>
            </form>
        </BaseModal>
    )
}
