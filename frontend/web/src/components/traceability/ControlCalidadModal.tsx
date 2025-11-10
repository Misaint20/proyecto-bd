"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, ClipboardCheck, Settings, Calendar, FileText, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getProcesosProduccion, createControlCalidad, updateControlCalidad } from "@/services/TraceabilityService"

interface ControlCalidadModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    control?: any
}

export default function ControlCalidadModal({ isOpen, onClose, onSuccess, control }: ControlCalidadModalProps) {
    const [formData, setFormData] = useState({
        id_proceso: "",
        tipo_control: "",
        fecha_analisis: new Date().toISOString().split("T")[0],
        resultados: "",
    })
    const [error, setError] = useState("")
    const [procesos, setProcesos] = useState<any[]>([])

    const mockProcesos = async () => {
        await getProcesosProduccion().then((result) => {
            if (result && result.success) {
                setProcesos(result.data)
            } else if (result) {
                console.error(`Error al obtener procesos de producción: ${result.errorMessage}`)
            }
        })
    }

    useEffect(() => {
        if (isOpen) {
            mockProcesos()

            if (control) {
                setFormData({
                    id_proceso: control.id_proceso || "",
                    tipo_control: control.tipo_control || "",
                    fecha_analisis: control.fecha_analisis
                        ? new Date(control.fecha_analisis).toISOString().split("T")[0]
                        : new Date().toISOString().split("T")[0],
                    resultados: control.resultados || "",
                })
            } else {
                setFormData({
                    id_proceso: "",
                    tipo_control: "",
                    fecha_analisis: new Date().toISOString().split("T")[0],
                    resultados: "",
                })
            }
            setError("")
        }
    }, [isOpen, control])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!formData.id_proceso || !formData.tipo_control) {
            setError("Por favor completa todos los campos obligatorios")
            return
        }

        const isUpdate = control !== null && control.id_control

        const dataToSend = {
            ...formData,
        }

        const result = isUpdate ? await updateControlCalidad(control.id_control, dataToSend) : await createControlCalidad(dataToSend)

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
                <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 flex items-center justify-between rounded-t-xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <ClipboardCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{control ? "Editar Control" : "Nuevo Control"}</h2>
                            <p className="text-green-100 text-sm">
                                {control ? "Actualiza los datos del control" : "Registra un nuevo control de calidad"}
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

                    {/* Proceso */}
                    <div className="space-y-2">
                        <Label htmlFor="id_proceso" className="flex items-center gap-2 text-foreground font-semibold">
                            <Settings className="h-4 w-4 text-green-600" />
                            Proceso de Producción *
                        </Label>
                        <Select
                            value={formData.id_proceso}
                            onValueChange={(value) => setFormData({ ...formData, id_proceso: value })}
                        >
                            <SelectTrigger className="border-2 focus:border-green-500">
                                <SelectValue placeholder="Selecciona un proceso" />
                            </SelectTrigger>
                            <SelectContent>
                                {procesos.map((proceso) => (
                                    <SelectItem key={proceso.id_proceso} value={proceso.id_proceso}>
                                        {proceso.nombre_proceso}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Tipo de Control */}
                    <div className="space-y-2">
                        <Label htmlFor="tipo_control" className="flex items-center gap-2 text-foreground font-semibold">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Tipo de Control *
                        </Label>
                        <Select
                            value={formData.tipo_control}
                            onValueChange={(value) => setFormData({ ...formData, tipo_control: value })}
                        >
                            <SelectTrigger className="border-2 focus:border-green-500">
                                <SelectValue placeholder="Selecciona el tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Microbiologico">Microbiológico</SelectItem>
                                <SelectItem value="Fisicoquimico">Fisicoquímico</SelectItem>
                                <SelectItem value="Sensorial">Sensorial</SelectItem>
                                <SelectItem value="Visual">Visual</SelectItem>
                                <SelectItem value="Cata">Catalógico</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Fecha Análisis */}
                    <div className="space-y-2">
                        <Label htmlFor="fecha_analisis" className="flex items-center gap-2 text-foreground font-semibold">
                            <Calendar className="h-4 w-4 text-green-600" />
                            Fecha de Análisis *
                        </Label>
                        <Input
                            id="fecha_analisis"
                            type="date"
                            value={formData.fecha_analisis}
                            onChange={(e) => setFormData({ ...formData, fecha_analisis: e.target.value })}
                            className="border-2 focus:border-green-500"
                            required
                        />
                    </div>

                    {/* Resultados */}
                    <div className="space-y-2">
                        <Label htmlFor="resultados" className="flex items-center gap-2 text-foreground font-semibold">
                            <FileText className="h-4 w-4 text-green-600" />
                            Resultados (Opcional)
                        </Label>
                        <Textarea
                            id="resultados"
                            value={formData.resultados}
                            onChange={(e) => setFormData({ ...formData, resultados: e.target.value })}
                            className="border-2 focus:border-green-500 min-h-[120px]"
                            placeholder="Describe los resultados del análisis..."
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1 border-2 bg-transparent">
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                        >
                            {control ? "Actualizar" : "Crear"} Control
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
