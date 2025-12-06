"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Droplets, Wine, Percent } from "lucide-react"
import { BaseModal } from "@/components/ui/base-modal"
import { ErrorAlert } from "@/components/ui/error-alert"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createMezclaVino, updateMezclaVino, getVarietales } from "@/services/MastersService"
import type { MezclaVino } from "@/types/masters"
import { getVinos } from "@/services/VinosService"
import { fetchData } from "@/lib/fetchData"
import type { Vino } from "@/types/vino"
import type { Varietal } from "@/types/masters"

type MezclaVinoModalProps = {
    open: boolean
    onClose: () => void
    mezcla?: MezclaVino | null
    onSuccess: () => void
}

export default function MezclaVinoModal({ open, onClose, mezcla, onSuccess }: MezclaVinoModalProps) {
    const [formData, setFormData] = useState({
        vino: (mezcla as any)?.id_vino ?? (mezcla as MezclaVino)?.Vino?.id_vino ?? "",
        varietal: (mezcla as any)?.id_varietal ?? (mezcla as MezclaVino)?.Varietal?.id_varietal ?? "",
        porcentaje: ((mezcla as any)?.porcentaje ?? (mezcla as MezclaVino)?.porcentaje)?.toString() || "",
    })
    const [error, setError] = useState("")
    const [vinos, setVinos] = useState<Vino[]>([])
    const [varietales, setVarietales] = useState<Varietal[]>([])

    useEffect(() => {
        fetchData(getVinos, setVinos, "vinos")
        fetchData(getVarietales, setVarietales, "varietales")
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!formData.vino || !formData.varietal || !formData.porcentaje) {
            setError("Por favor, complete todos los campos obligatorios.")
            return
        }

        const dataToSend = {
            id_vino: formData.vino,
            id_varietal: formData.varietal,
            porcentaje: Number.parseFloat(formData.porcentaje),
        }

        const mezclaId = (mezcla as any)?.id_mezcla ?? (mezcla as MezclaVino)?.id_mezcla
        const isUpdate = !!mezclaId

        const serviceCall = isUpdate ? updateMezclaVino(mezclaId as string, dataToSend) : createMezclaVino(dataToSend)

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
        <BaseModal
            isOpen={open}
            onClose={onClose}
            title={mezcla ? "Editar Mezcla de Vino" : "Nueva Mezcla"}
            icon={<Droplets className="h-6 w-6 text-white" />}
            gradientColors="from-purple-600 via-pink-600 to-rose-600"
            maxWidth="max-w-2xl"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <ErrorAlert message={error} />

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                            <Wine className="w-4 h-4 text-purple-600" />
                            Nombre del Vino *
                        </label>
                        <Select value={formData.vino} onValueChange={(value) => setFormData({ ...formData, vino: value })}>
                            <SelectTrigger className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-foreground">
                                <SelectValue placeholder="Selecciona un vino" />
                            </SelectTrigger>
                            <SelectContent>
                                {vinos.map((vino) => (
                                    <SelectItem key={vino.id_vino} value={vino.id_vino}>
                                        {vino.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                            <Wine className="w-4 h-4 text-purple-600" />
                            Nombre del Varietal *
                        </label>
                        <Select value={formData.varietal} onValueChange={(value) => setFormData({ ...formData, varietal: value })}>
                            <SelectTrigger className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-foreground">
                                <SelectValue placeholder="Selecciona un varietal" />
                            </SelectTrigger>
                            <SelectContent>
                                {varietales.map((varietal) => (
                                    <SelectItem key={varietal.id_varietal} value={varietal.id_varietal}>
                                        {varietal.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                            <Percent className="w-4 h-4 text-purple-600" />
                            Porcentaje *
                        </label>
                        <Select
                            value={formData.porcentaje}
                            onValueChange={(value) => setFormData({ ...formData, porcentaje: value })}
                        >
                            <SelectTrigger className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-foreground">
                                <SelectValue placeholder="Selecciona el porcentaje" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5%</SelectItem>
                                <SelectItem value="10">10%</SelectItem>
                                <SelectItem value="15">15%</SelectItem>
                                <SelectItem value="20">20%</SelectItem>
                                <SelectItem value="25">25%</SelectItem>
                                <SelectItem value="30">30%</SelectItem>
                                <SelectItem value="35">35%</SelectItem>
                                <SelectItem value="40">40%</SelectItem>
                                <SelectItem value="45">45%</SelectItem>
                                <SelectItem value="50">50%</SelectItem>
                                <SelectItem value="55">55%</SelectItem>
                                <SelectItem value="60">60%</SelectItem>
                                <SelectItem value="65">65%</SelectItem>
                                <SelectItem value="70">70%</SelectItem>
                                <SelectItem value="75">75%</SelectItem>
                                <SelectItem value="80">80%</SelectItem>
                                <SelectItem value="85">85%</SelectItem>
                                <SelectItem value="90">90%</SelectItem>
                                <SelectItem value="95">95%</SelectItem>
                                <SelectItem value="100">100%</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onClose} className="flex-1 border-2 bg-transparent">
                        Cancelar
                    </Button>
                    <Button type="submit" className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all hover:scale-105 font-semibold shadow-lg">
                        {mezcla ? "Actualizar" : "Crear"} Mezcla
                    </Button>
                </div>
            </form>
        </BaseModal>
    )
}
