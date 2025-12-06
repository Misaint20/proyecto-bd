"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, ClipboardCheck, Settings, Calendar, FileText, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BaseModal } from "@/components/ui/base-modal"
import { ErrorAlert } from "@/components/ui/error-alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getProcesosProduccion, createControlCalidad, updateControlCalidad } from "@/services/TraceabilityService"
import type { ControlCalidad, ProcesoProduccion } from "@/types/traceability"

interface ControlCalidadModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    control?: ControlCalidad | null
}

export default function ControlCalidadModal({ isOpen, onClose, onSuccess, control }: ControlCalidadModalProps) {
    const [formData, setFormData] = useState({
        id_proceso: "",
        tipo_control: "",
        fecha_analisis: new Date().toISOString().split("T")[0],
        resultados: "",
    })
    const [error, setError] = useState("")
    const [procesos, setProcesos] = useState<ProcesoProduccion[]>([])

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

        const controlId = (control as any)?.id_control ?? control?.id_control
        const isUpdate = !!controlId

        const dataToSend = {
            ...formData,
        }

        const result = isUpdate ? await updateControlCalidad(controlId as string, dataToSend) : await createControlCalidad(dataToSend)

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
            title={control ? "Editar Control" : "Nuevo Control"}
            subtitle={control ? "Actualiza los datos del control" : "Registra un nuevo control de calidad"}
            icon={<ClipboardCheck className="h-6 w-6 text-white" />}
            gradientColors="from-green-600 to-emerald-600"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <ErrorAlert message={error} />

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
        </BaseModal>
    )
}
