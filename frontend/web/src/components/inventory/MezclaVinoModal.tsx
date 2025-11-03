"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Droplets, Wine, Percent } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createMezclaVino, updateMezclaVino, getVarietales } from "@/services/MastersService"
import { getVinos } from "@/services/VinosService"
import type { Vino } from "@/types/vino"
import type { Varietal } from "@/types/masters"

type MezclaVinoModalProps = {
    open: boolean
    onClose: () => void
    mezcla?: any
    onSuccess: () => void
}

export default function MezclaVinoModal({ open, onClose, mezcla, onSuccess }: MezclaVinoModalProps) {
    const [formData, setFormData] = useState({
        vino: mezcla?.vino || "",
        varietal: mezcla?.varietal || "",
        porcentaje: mezcla?.porcentaje?.toString() || "",
    })
    const [error, setError] = useState("")
    const [vinos, setVinos] = useState<Vino[]>([])
    const [varietales, setVarietales] = useState<Varietal[]>([])

    useEffect(() => {
        async function fetchData() {
            const vinos = await getVinos()
            const varietales = await getVarietales()

            if (!vinos?.success && !varietales?.success) {
                console.error("Error al obtener datos de vinos y varietales:", vinos?.errorMessage || varietales?.errorMessage)
            }

            setVinos(vinos?.data || [])
            setVarietales(varietales?.data.data || [])
        }
        fetchData()
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

        console.log(dataToSend);

        const isUpdate = mezcla !== null && mezcla.id_mezcla

        const serviceCall = isUpdate ? updateMezclaVino(mezcla.id_mezcla, dataToSend) : createMezclaVino(dataToSend)

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
                <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                                <Droplets className="h-6 w-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold">{mezcla ? "Editar Mezcla de Vino" : "Nueva Mezcla"}</h2>
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
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border-2 border-border rounded-lg hover:bg-accent transition-all hover:scale-105 font-semibold text-foreground"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all hover:scale-105 font-semibold shadow-lg"
                        >
                            {mezcla ? "Actualizar" : "Crear"} Mezcla
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
