"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Package, Wine, Calendar, Droplet, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createLote, getCosechas, updateLote } from "@/services/TraceabilityService"
import { getVinos } from "@/services/VinosService"
import { getBarricas } from "@/services/MastersService"

interface LoteModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    lote?: any
}

export default function LoteModal({ isOpen, onClose, onSuccess, lote }: LoteModalProps) {
    const [formData, setFormData] = useState({
        id_vino: "",
        id_cosecha: "",
        id_barrica: "",
        numero_lote: "",
        cantidad_botellas: "",
        fecha_embotellado: new Date().toISOString().split("T")[0],
    })
    const [error, setError] = useState("")
    const [vinosData, setVinosData] = useState<any[]>([])
    const [cosechasData, setCosechasData] = useState<any[]>([])
    const [barricasData, setBarricasData] = useState<any[]>([])

    useEffect(() => {
        if (isOpen) {
            loadData()
            if (lote) {
                setFormData({
                    id_vino: lote.id_vino || "",
                    id_cosecha: lote.id_cosecha || "",
                    id_barrica: lote.id_barrica || "",
                    numero_lote: lote.numero_lote || "",
                    cantidad_botellas: lote.cantidad_botellas?.toString() || "",
                    fecha_embotellado: lote.fecha_embotellado
                        ? new Date(lote.fecha_embotellado).toISOString().split("T")[0]
                        : new Date().toISOString().split("T")[0],
                })
            } else {
                setFormData({
                    id_vino: "",
                    id_cosecha: "",
                    id_barrica: "",
                    numero_lote: "",
                    cantidad_botellas: "",
                    fecha_embotellado: new Date().toISOString().split("T")[0],
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
            setBarricasData(barricasData?.data.data)
        } catch (err) {
            console.error("Error loading data:", err)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!formData.id_vino || !formData.id_cosecha || !formData.numero_lote || !formData.cantidad_botellas) {
            setError("Por favor completa todos los campos obligatorios")
            return
        }

        const isUpdate = lote !== null && lote?.id_lote

        if (formData.id_barrica == "none") formData.id_barrica = ""

        const dataToSend = {
            ...formData,
            cantidad_botellas: Number.parseInt(formData.cantidad_botellas),
            id_barrica: formData.id_barrica || undefined,
        }

        const result = isUpdate ? await updateLote(lote.id_lote, dataToSend) : await createLote(dataToSend)

        if (result && result.success) {
            onSuccess()
            onClose()
        } else {
            setError(result?.errorMessage || "Ocurrió un error desconocido.")
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-border">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 flex items-center justify-between rounded-t-xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Package className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{lote ? "Editar Lote" : "Nuevo Lote"}</h2>
                            <p className="text-blue-100 text-sm">
                                {lote ? "Actualiza los datos del lote" : "Registra un nuevo lote"}
                            </p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 rounded-full">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-4">
                            <p className="text-red-800 dark:text-red-200 text-sm font-medium">{error}</p>
                        </div>
                    )}

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
                        <Select
                            value={formData.cantidad_botellas}
                            onValueChange={(value) => setFormData({ ...formData, cantidad_botellas: value })}
                        >
                            <SelectTrigger className="border-2 focus:border-blue-500">
                                <SelectValue placeholder="Selecciona cantidad" />
                            </SelectTrigger>
                            <SelectContent>
                                {[100, 250, 500, 1000, 2000, 5000, 10000].map((cantidad) => (
                                    <SelectItem key={cantidad} value={cantidad.toString()}>
                                        {cantidad} botellas
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
            </div>
        </div>
    )
}
