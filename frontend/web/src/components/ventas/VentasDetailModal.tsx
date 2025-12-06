"use client"

import { useState, useEffect } from "react"
import { X, ShoppingCart, Wine, DollarSign, Calendar, User, Package } from "lucide-react"
import { BaseModal } from "@/components/ui/base-modal"
import { Button } from "@/components/ui/button"
import { getVentaDetail } from "@/services/VentasDetailService"
import { showAlert } from "@/lib/alert"
import type { Venta } from "@/types/ventas"

interface VentasDetailModalProps {
    ventaId: string
    onClose: () => void
}

interface VentaDetail extends Venta {
    Detalle_Venta?: Array<{
        id_detalle?: string
        id_vino: string
        id_lote?: string
        cantidad: number
        precio_unitario: number
        subtotal: number
        Vino?: {
            nombre: string
            tipo: string
        }
    }>
}

export default function VentasDetailModal({ ventaId, onClose }: VentasDetailModalProps) {
    const [venta, setVenta] = useState<VentaDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        fetchVentaDetail()
    }, [ventaId])

    const fetchVentaDetail = async () => {
        setLoading(true)
        setError("")

        const result = await getVentaDetail(ventaId)

        if (result && result.success && result.data) {
            setVenta(result.data)
        } else {
            setError(result?.errorMessage || "Error al cargar los detalles de la venta")
            showAlert({ description: "No se pudo cargar la venta" })
        }

        setLoading(false)
    }

    return (
        <BaseModal
            isOpen={true}
            onClose={onClose}
            title="Detalle de Venta"
            icon={<ShoppingCart className="w-6 h-6 text-white" />}
            gradientColors="from-[#5e2129] via-[#7d2b35] to-[#8b7355]"
            maxWidth="max-w-2xl"
        >
            {loading ? (
                <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5e2129] dark:border-[#d4a574] mx-auto"></div>
                    <p className="text-muted-foreground mt-4">Cargando detalles...</p>
                </div>
            ) : error ? (
                <div className="p-6">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                        <span className="font-semibold">Error:</span> {error}
                    </div>
                </div>
            ) : venta ? (
                <div className="space-y-6">
                    {/* Encabezado con info principal */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-[#5e2129]/10 to-[#d4a574]/10 dark:from-[#5e2129]/20 dark:to-[#d4a574]/20 p-4 rounded-xl border border-[#5e2129]/20 dark:border-[#d4a574]/20">
                            <div className="flex items-center gap-2 mb-2">
                                <User className="w-4 h-4 text-[#5e2129] dark:text-[#d4a574]" />
                                <span className="text-sm font-medium text-muted-foreground">Cliente</span>
                            </div>
                            <p className="text-lg font-bold text-foreground">{venta.cliente}</p>
                        </div>

                        <div className="bg-gradient-to-br from-[#5e2129]/10 to-[#d4a574]/10 dark:from-[#5e2129]/20 dark:to-[#d4a574]/20 p-4 rounded-xl border border-[#5e2129]/20 dark:border-[#d4a574]/20">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-4 h-4 text-[#5e2129] dark:text-[#d4a574]" />
                                <span className="text-sm font-medium text-muted-foreground">Fecha</span>
                            </div>
                            <p className="text-lg font-bold text-foreground">
                                {new Date(venta.fecha_venta).toLocaleDateString("es-MX", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Detalles de productos */}
                    <div className="border border-border rounded-xl p-4 bg-accent/30">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5 text-[#5e2129] dark:text-[#d4a574]" />
                            Productos ({venta.Detalle_Venta?.length || 0})
                        </h3>

                        {venta.Detalle_Venta && venta.Detalle_Venta.length > 0 ? (
                            <div className="space-y-3">
                                {venta.Detalle_Venta.map((detalle, index) => (
                                    <div
                                        key={detalle.id_detalle || index}
                                        className="flex items-center justify-between p-4 bg-card rounded-lg border border-border hover:shadow-md transition-all"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Wine className="w-4 h-4 text-[#5e2129] dark:text-[#d4a574]" />
                                                <h4 className="font-semibold text-foreground">
                                                    {detalle.Vino?.nombre || "Vino desconocido"}
                                                </h4>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {detalle.Vino?.tipo && <span>{detalle.Vino.tipo} • </span>}
                                                {detalle.cantidad} {detalle.cantidad === 1 ? "botella" : "botellas"}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-muted-foreground mb-1">
                                                ${Number(detalle.precio_unitario).toFixed(2)} * {detalle.cantidad}
                                            </p>
                                            <p className="text-lg font-bold text-[#5e2129] dark:text-[#d4a574]">
                                                ${Number(detalle.subtotal).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                <p className="font-medium">No hay productos en esta venta</p>
                            </div>
                        )}
                    </div>

                    {/* Total */}
                    <div className="bg-gradient-to-r from-[#5e2129]/10 to-[#d4a574]/10 dark:from-[#5e2129]/20 dark:to-[#d4a574]/20 p-6 rounded-xl border-2 border-[#5e2129]/30 dark:border-[#d4a574]/30">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-6 h-6 text-[#5e2129] dark:text-[#d4a574]" />
                                <span className="text-xl font-semibold text-foreground">Total:</span>
                            </div>
                            <span className="text-3xl font-bold text-[#5e2129] dark:text-[#d4a574]">
                                ${Number(venta.total).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Botón cerrar */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="w-full"
                        >
                            Cerrar
                        </Button>
                    </div>
                </div>
            ) : null}
        </BaseModal>
    )
}
