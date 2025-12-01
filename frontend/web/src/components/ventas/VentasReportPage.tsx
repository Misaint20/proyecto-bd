"use client"

import { useState, useEffect } from "react"
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { getVentas } from "@/services/VentasService"
import { getInventarioValorizado, getVentasPorPeriodo } from "@/services/ReportesService"
import { fetchData } from "@/lib/fetchData"
import { Search, FileText, Eye, DollarSign, TrendingUp, Package, ArrowLeft } from "lucide-react"
import type { Venta } from "@/types/ventas"
import type { InventarioValorizadoReport, VentasPeriodoReport } from "@/services/ReportesService"

const VentasDetailModal = dynamic(() => import('@/components/ventas/VentasDetailModal'), { ssr: false })

type TabType = "ventas" | "inventario" | "periodo"

export default function VentasReportPage() {
    const [tab, setTab] = useState<TabType>("ventas")
    const [ventas, setVentas] = useState<Venta[]>([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")

    const [showDetailModal, setShowDetailModal] = useState(false)
    const [selectedVentaId, setSelectedVentaId] = useState<string | null>(null)

    // Inventario Valorizado
    const [inventarioReport, setInventarioReport] = useState<InventarioValorizadoReport | null>(null)
    const [loadingInventario, setLoadingInventario] = useState(false)

    // Ventas por Período
    const [ventasPeriodoReport, setVentasPeriodoReport] = useState<VentasPeriodoReport | null>(null)
    const [loadingPeriodo, setLoadingPeriodo] = useState(false)
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")

    useEffect(() => {
        if (tab === "ventas") {
            setLoading(true)
            fetchData(getVentas, setVentas, "ventas-report", setLoading)
        }
    }, [tab])

    const handleLoadInventarioReport = async () => {
        setLoadingInventario(true)
        const result = await getInventarioValorizado()
        if (result.success && result.data) {
            setInventarioReport(result.data)
        }
        setLoadingInventario(false)
    }

    const handleLoadPeriodoReport = async () => {
        if (!startDate || !endDate) {
            alert("Por favor selecciona ambas fechas")
            return
        }
        setLoadingPeriodo(true)
        const result = await getVentasPorPeriodo(startDate, endDate)
        if (result.success && result.data) {
            setVentasPeriodoReport(result.data)
        }
        setLoadingPeriodo(false)
    }

    const filtered = ventas.filter(v => v.cliente.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="min-h-screen bg-background p-6">
            {/* Header */}
            <div className="mb-6 bg-gradient-to-r from-[#5e2129] via-[#7d2b35] to-[#8b7355] p-6 rounded-2xl shadow-xl">
                <div className="flex items-center gap-3">
                    <Link
                        href='/'
                        className="bg-white/20 p-3 rounded-xl backdrop-blur-sm hover:bg-white/30 transition-all hover:scale-105"
                    >
                        <ArrowLeft className="w-6 h-6 text-white" />
                    </Link>
                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Reportes</h2>
                        <p className="text-white/90 mt-1">Visualiza datos de ventas e inventario</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
                {(["ventas", "inventario", "periodo"] as const).map(t => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${tab === t
                                ? "bg-gradient-to-r from-[#5e2129] to-[#8b7355] text-white shadow-lg"
                                : "bg-card border border-border text-foreground hover:bg-accent"
                            }`}
                    >
                        {t === "ventas" && "📊 Ventas"}
                        {t === "inventario" && "📦 Inventario Valorizado"}
                        {t === "periodo" && "📈 Ventas por Período"}
                    </button>
                ))}
            </div>

            {/* Content */}
            {tab === "ventas" && (
                <div className="bg-card rounded-xl p-4 border border-border shadow-lg">
                    <div className="mb-4 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar cliente..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground"
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto text-left text-sm">
                            <thead>
                                <tr className="text-muted-foreground border-b border-border">
                                    <th className="px-4 py-3 font-semibold">Cliente</th>
                                    <th className="px-4 py-3 font-semibold">Fecha</th>
                                    <th className="px-4 py-3 font-semibold">Productos</th>
                                    <th className="px-4 py-3 font-semibold">Total</th>
                                    <th className="px-4 py-3 font-semibold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                                            <div className="flex justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5e2129]"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-muted-foreground">No hay ventas</td>
                                    </tr>
                                ) : (
                                    filtered.map(v => (
                                        <tr key={v.id_venta} className="border-t border-border hover:bg-background/50">
                                            <td className="px-4 py-3">
                                                <div className="font-semibold">{v.cliente}</div>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {new Date(v.fecha_venta).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                {v.Detalle_Venta?.length || v.detalles?.length || 0}
                                            </td>
                                            <td className="px-4 py-3 font-bold text-[#5e2129]">
                                                ${Number(v.total).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => {
                                                        setSelectedVentaId(v.id_venta)
                                                        setShowDetailModal(true)
                                                    }}
                                                    className="px-3 py-1 bg-gradient-to-r from-[#5e2129] to-[#7d2b35] text-white text-xs rounded flex items-center gap-1 hover:scale-105 transition-transform"
                                                >
                                                    <Eye className="w-3 h-3" /> Ver
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {tab === "inventario" && (
                <div className="space-y-4">
                    <button
                        onClick={handleLoadInventarioReport}
                        disabled={loadingInventario}
                        className="px-6 py-3 bg-gradient-to-r from-[#5e2129] to-[#8b7355] text-white rounded-lg hover:from-[#7d2b35] hover:to-[#9d8565] transition-all hover:scale-105 font-semibold disabled:opacity-50"
                    >
                        {loadingInventario ? "Cargando..." : "Cargar Reporte"}
                    </button>

                    {inventarioReport && (
                        <div className="space-y-4">
                            <div className="bg-gradient-to-r from-[#5e2129]/10 to-[#d4a574]/10 dark:from-[#5e2129]/20 dark:to-[#d4a574]/20 p-6 rounded-xl border-2 border-[#5e2129]/30 dark:border-[#d4a574]/30">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-6 h-6 text-[#5e2129] dark:text-[#d4a574]" />
                                        <span className="text-xl font-semibold text-foreground">Valor Total del Inventario:</span>
                                    </div>
                                    <span className="text-3xl font-bold text-[#5e2129] dark:text-[#d4a574]">
                                        ${Number(inventarioReport.valor_total_inventario).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-card rounded-xl p-4 border border-border shadow-lg">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-[#5e2129]" />
                                    Detalles por Lote
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full table-auto text-left text-sm">
                                        <thead>
                                            <tr className="text-muted-foreground border-b border-border">
                                                <th className="px-4 py-3 font-semibold">Lote</th>
                                                <th className="px-4 py-3 font-semibold">Vino</th>
                                                <th className="px-4 py-3 font-semibold">Ubicación</th>
                                                <th className="px-4 py-3 font-semibold">Stock</th>
                                                <th className="px-4 py-3 font-semibold">Precio Unitario</th>
                                                <th className="px-4 py-3 font-semibold">Valor Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {inventarioReport.detalles.map((det, idx) => (
                                                <tr key={idx} className="border-t border-border hover:bg-background/50">
                                                    <td className="px-4 py-3 font-mono text-sm">{det.numero_lote}</td>
                                                    <td className="px-4 py-3">{det.vino}</td>
                                                    <td className="px-4 py-3">{det.ubicacion}</td>
                                                    <td className="px-4 py-3">{det.stock} bot.</td>
                                                    <td className="px-4 py-3">${det.precio_unitario.toFixed(2)}</td>
                                                    <td className="px-4 py-3 font-bold text-[#5e2129]">
                                                        ${det.valor_stock_lote.toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {tab === "periodo" && (
                <div className="space-y-4">
                    <div className="bg-card rounded-xl p-4 border border-border shadow-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="text-sm font-semibold text-foreground block mb-2">Fecha Inicio</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-foreground block mb-2">Fecha Fin</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={handleLoadPeriodoReport}
                                    disabled={loadingPeriodo}
                                    className="w-full px-6 py-2 bg-gradient-to-r from-[#5e2129] to-[#8b7355] text-white rounded-lg hover:from-[#7d2b35] hover:to-[#9d8565] transition-all hover:scale-105 font-semibold disabled:opacity-50"
                                >
                                    {loadingPeriodo ? "Cargando..." : "Generar Reporte"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {ventasPeriodoReport && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gradient-to-br from-[#5e2129]/10 to-[#d4a574]/10 dark:from-[#5e2129]/20 dark:to-[#d4a574]/20 p-4 rounded-xl border border-[#5e2129]/20 dark:border-[#d4a574]/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="w-4 h-4 text-[#5e2129]" />
                                        <span className="text-sm font-medium text-muted-foreground">Transacciones</span>
                                    </div>
                                    <p className="text-2xl font-bold text-foreground">{ventasPeriodoReport.numero_transacciones}</p>
                                </div>

                                <div className="bg-gradient-to-br from-[#5e2129]/10 to-[#d4a574]/10 dark:from-[#5e2129]/20 dark:to-[#d4a574]/20 p-4 rounded-xl border border-[#5e2129]/20 dark:border-[#d4a574]/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <DollarSign className="w-4 h-4 text-[#5e2129]" />
                                        <span className="text-sm font-medium text-muted-foreground">Total Ingresos</span>
                                    </div>
                                    <p className="text-2xl font-bold text-[#5e2129]">${Number(ventasPeriodoReport.total_ingresos).toFixed(2)}</p>
                                </div>

                                <div className="bg-gradient-to-br from-[#5e2129]/10 to-[#d4a574]/10 dark:from-[#5e2129]/20 dark:to-[#d4a574]/20 p-4 rounded-xl border border-[#5e2129]/20 dark:border-[#d4a574]/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Package className="w-4 h-4 text-[#5e2129]" />
                                        <span className="text-sm font-medium text-muted-foreground">Botellas Vendidas</span>
                                    </div>
                                    <p className="text-2xl font-bold text-foreground">{ventasPeriodoReport.total_botellas_vendidas}</p>
                                </div>
                            </div>

                            <div className="bg-card rounded-xl p-4 border border-border shadow-lg">
                                <h3 className="text-lg font-semibold mb-4">Ventas Período: {ventasPeriodoReport.periodo}</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full table-auto text-left text-sm">
                                        <thead>
                                            <tr className="text-muted-foreground border-b border-border">
                                                <th className="px-4 py-3 font-semibold">Cliente</th>
                                                <th className="px-4 py-3 font-semibold">Fecha</th>
                                                <th className="px-4 py-3 font-semibold">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ventasPeriodoReport.detalles_ventas.map(v => (
                                                <tr key={v.id_venta} className="border-t border-border hover:bg-background/50">
                                                    <td className="px-4 py-3">{v.cliente}</td>
                                                    <td className="px-4 py-3 text-muted-foreground">
                                                        {new Date(v.fecha).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-3 font-bold text-[#5e2129]">
                                                        ${Number(v.total).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {showDetailModal && selectedVentaId && (
                <VentasDetailModal
                    ventaId={selectedVentaId}
                    onClose={() => {
                        setShowDetailModal(false)
                        setSelectedVentaId(null)
                    }}
                />
            )}
        </div>
    )
}
