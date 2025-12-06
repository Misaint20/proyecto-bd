"use client"

import type React from "react"
import { useState } from "react"
import type { Vino } from "@/types/vino"
import { createVino, updateVino } from "@/services/VinosService"
import { Wine, Calendar, DollarSign, Package, FileText, X } from "lucide-react"
import { BaseModal } from "@/components/ui/base-modal"
import { FormField } from "@/components/ui/form-field"
import { ErrorAlert } from "@/components/ui/error-alert"
import { Button } from "@/components/ui/button"

export default function VinoModal({
    vino,
    onClose,
    onSuccess,
}: {
    vino: Vino | null
    onClose: () => void
    onSuccess: () => void
}) {
    const tiposVino = ["Tinto", "Blanco", "Rosado", "Espumoso"]

    const [formData, setFormData] = useState({
        nombre: vino?.nombre || "",
        tipo: vino?.tipo || tiposVino[0],
        anio_cosecha: vino?.anio_cosecha || new Date().getFullYear(),
        precio_botella: vino?.precio_botella || 0,
        botellas_por_caja: vino?.botellas_por_caja || 12,
        descripcion: vino?.descripcion || "",
    })
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (formData.nombre.trim() === "" || formData.precio_botella <= 0) {
            setError("Por favor, complete todos los campos obligatorios.")
            return
        }

        const vinoId = (vino as any)?.id_vino ?? vino?.id_vino
        const isUpdate = !!vinoId

        const serviceCall = isUpdate ? updateVino(vinoId as string, formData) : createVino(formData)

        const result = await serviceCall

        if (result && result.success) {
            onSuccess()
        } else {
            setError(result?.errorMessage || "Ocurrió un error desconocido.")
        }
    }

    return (
        <BaseModal
            isOpen={true}
            onClose={onClose}
            title={vino ? "Editar Vino" : "Nuevo Vino"}
            icon={<Wine className="w-6 h-6 text-white" />}
            gradientColors="from-rose-800 via-rose-700 to-rose-800 dark:from-rose-900 dark:via-rose-800 dark:to-rose-900"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <ErrorAlert message={error} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        label="Nombre"
                        required
                        icon={<Wine className="w-4 h-4" />}
                        iconColor="text-rose-700 dark:text-rose-400"
                        htmlFor="nombre"
                    >
                        <input
                            id="nombre"
                            type="text"
                            required
                            maxLength={100}
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-600 transition-all text-foreground"
                            placeholder="Ej: Reserva Especial"
                        />
                    </FormField>

                    <FormField
                        label="Tipo"
                        required
                        icon={<Wine className="w-4 h-4" />}
                        iconColor="text-rose-700 dark:text-rose-400"
                        htmlFor="tipo"
                    >
                        <select
                            id="tipo"
                            required
                            value={formData.tipo}
                            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-600 transition-all text-foreground"
                        >
                            {tiposVino.map((tipo) => (
                                <option key={tipo} value={tipo}>
                                    {tipo}
                                </option>
                            ))}
                        </select>
                    </FormField>

                    <FormField
                        label="Año de Cosecha"
                        required
                        icon={<Calendar className="w-4 h-4" />}
                        iconColor="text-rose-700 dark:text-rose-400"
                        htmlFor="anio_cosecha"
                    >
                        <input
                            id="anio_cosecha"
                            type="number"
                            required
                            min="1900"
                            max="2100"
                            value={formData.anio_cosecha}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    anio_cosecha: Number.parseInt(e.target.value) || new Date().getFullYear(),
                                })
                            }
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-600 transition-all text-foreground"
                        />
                    </FormField>

                    <FormField
                        label="Precio por Botella"
                        required
                        icon={<DollarSign className="w-4 h-4" />}
                        iconColor="text-rose-700 dark:text-rose-400"
                        htmlFor="precio_botella"
                    >
                        <input
                            id="precio_botella"
                            type="number"
                            required
                            step="0.01"
                            min="0"
                            value={formData.precio_botella}
                            onChange={(e) => setFormData({ ...formData, precio_botella: Number.parseFloat(e.target.value) || 0 })}
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-600 transition-all text-foreground"
                            placeholder="0.00"
                        />
                    </FormField>

                    <FormField
                        label="Botellas por Caja"
                        icon={<Package className="w-4 h-4" />}
                        iconColor="text-rose-700 dark:text-rose-400"
                        htmlFor="botellas_por_caja"
                    >
                        <input
                            id="botellas_por_caja"
                            type="number"
                            min="0"
                            value={formData.botellas_por_caja}
                            onChange={(e) => setFormData({ ...formData, botellas_por_caja: Number.parseInt(e.target.value) || 12 })}
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-600 transition-all text-foreground"
                        />
                        <p className="text-xs text-muted-foreground mt-1.5 ml-1">Por defecto: 12 botellas</p>
                    </FormField>
                </div>

                <FormField
                    label="Descripción"
                    icon={<FileText className="w-4 h-4" />}
                    iconColor="text-rose-700 dark:text-rose-400"
                    htmlFor="descripcion"
                >
                    <textarea
                        id="descripcion"
                        value={formData.descripcion}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-600 transition-all text-foreground resize-none"
                        placeholder="Describe las características del vino..."
                    />
                </FormField>

                <div className="flex gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 border-2"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-rose-700 to-rose-800 dark:from-rose-800 dark:to-rose-900 text-white hover:from-rose-800 hover:to-rose-900 transition-all hover:scale-105 shadow-lg"
                    >
                        {vino ? "Actualizar" : "Crear"} Vino
                    </Button>
                </div>
            </form>
        </BaseModal>
    )
}