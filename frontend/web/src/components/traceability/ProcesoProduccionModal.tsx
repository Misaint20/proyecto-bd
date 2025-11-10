"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Settings, Package, Droplet, Calendar, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getLotes, createProcesoProduccion, updateProcesoProduccion } from "@/services/TraceabilityService"

interface ProcesoProduccionModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    proceso?: any
}

export default function ProcesoProduccionModal({ isOpen, onClose, onSuccess, proceso }: ProcesoProduccionModalProps) {
    const [formData, setFormData] = useState({
        nombre_proceso: "",
        id_lote: "",
        fecha_inicio: new Date().toISOString().split("T")[0],
        fecha_fin: "",
        descripcion: "",
    })
    const [error, setError] = useState("")
    const [lotes, setLotes] = useState<any[]>([])

    const mockLotes = async () => {
        await getLotes().then((result) => {
            if (result && result.success) {
                setLotes(result.data)
            } else if (result) {
                console.error(`Error al obtener lotes: ${result.errorMessage}`)
            }
        })
    }

    useEffect(() => {
        if (isOpen) {
            mockLotes()

            if (proceso) {
                setFormData({
                    nombre_proceso: proceso.nombre_proceso || "",
                    id_lote: proceso.id_lote || "",
                    fecha_inicio: proceso.fecha_inicio
                        ? new Date(proceso.fecha_inicio).toISOString().split("T")[0]
                        : new Date().toISOString().split("T")[0],
                    fecha_fin: proceso.fecha_fin ? new Date(proceso.fecha_fin).toISOString().split("T")[0] : "",
                    descripcion: proceso.descripcion || "",
                })
            } else {
                setFormData({
                    nombre_proceso: "",
                    id_lote: "",
                    fecha_inicio: new Date().toISOString().split("T")[0],
                    fecha_fin: "",
                    descripcion: "",
                })
            }
            setError("")
        }
    }, [isOpen, proceso])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!formData.nombre_proceso || !formData.id_lote) {
            setError("Por favor completa todos los campos obligatorios")
            return
        }

        const isUpdate = proceso !== null && proceso?.id_proceso

        const dataToSend = {
            ...formData,
        }

        const result = isUpdate ? await updateProcesoProduccion(proceso.id_proceso, dataToSend) : await createProcesoProduccion(dataToSend)

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
                <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 flex items-center justify-between rounded-t-xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Settings className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{proceso ? "Editar Proceso" : "Nuevo Proceso"}</h2>
                            <p className="text-orange-100 text-sm">
                                {proceso ? "Actualiza los datos del proceso" : "Registra un nuevo proceso de producción"}
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

                    {/* Nombre Proceso */}
                    <div className="space-y-2">
                        <Label htmlFor="nombre_proceso" className="flex items-center gap-2 text-foreground font-semibold">
                            <Settings className="h-4 w-4 text-orange-600" />
                            Nombre del Proceso *
                        </Label>
                        <Input
                            id="nombre_proceso"
                            value={formData.nombre_proceso}
                            onChange={(e) => setFormData({ ...formData, nombre_proceso: e.target.value })}
                            className="border-2 focus:border-orange-500"
                            placeholder="Ej: Fermentación, Clarificación, etc."
                            required
                        />
                    </div>

                    {/* Lote */}
                    <div className="space-y-2">
                        <Label htmlFor="id_lote" className="flex items-center gap-2 text-foreground font-semibold">
                            <Package className="h-4 w-4 text-orange-600" />
                            Lote *
                        </Label>
                        <Select value={formData.id_lote} onValueChange={(value) => setFormData({ ...formData, id_lote: value })}>
                            <SelectTrigger className="border-2 focus:border-orange-500">
                                <SelectValue placeholder="Selecciona un lote" />
                            </SelectTrigger>
                            <SelectContent>
                                {lotes.map((lote) => (
                                    <SelectItem key={lote.id_lote} value={lote.id_lote}>
                                        {lote.numero_lote}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Fecha Inicio */}
                    <div className="space-y-2">
                        <Label htmlFor="fecha_inicio" className="flex items-center gap-2 text-foreground font-semibold">
                            <Calendar className="h-4 w-4 text-orange-600" />
                            Fecha de Inicio *
                        </Label>
                        <Input
                            id="fecha_inicio"
                            type="date"
                            value={formData.fecha_inicio}
                            onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
                            className="border-2 focus:border-orange-500"
                            required
                        />
                    </div>

                    {/* Fecha Fin (Opcional) */}
                    <div className="space-y-2">
                        <Label htmlFor="fecha_fin" className="flex items-center gap-2 text-foreground font-semibold">
                            <Calendar className="h-4 w-4 text-orange-600" />
                            Fecha de Fin (Opcional)
                        </Label>
                        <Input
                            id="fecha_fin"
                            type="date"
                            value={formData.fecha_fin}
                            onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
                            className="border-2 focus:border-orange-500"
                        />
                    </div>

                    {/* Descripción */}
                    <div className="space-y-2">
                        <Label htmlFor="descripcion" className="flex items-center gap-2 text-foreground font-semibold">
                            <FileText className="h-4 w-4 text-orange-600" />
                            Descripción (Opcional)
                        </Label>
                        <Textarea
                            id="descripcion"
                            value={formData.descripcion}
                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                            className="border-2 focus:border-orange-500 min-h-[100px]"
                            placeholder="Describe el proceso..."
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1 border-2 bg-transparent">
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg"
                        >
                            {proceso ? "Actualizar" : "Crear"} Proceso
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
