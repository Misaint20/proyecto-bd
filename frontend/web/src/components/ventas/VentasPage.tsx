"use client"

import { useState, useEffect } from "react"
import dynamic from 'next/dynamic'
import { ShoppingCart, Plus, Search, Eye, Trash2, ArrowLeft, DollarSign } from "lucide-react"
import { useRouter } from "next/navigation"
import { getVentas, deleteVenta } from "@/services/VentasService"
import { fetchData } from "@/lib/fetchData"
import { performDelete } from "@/lib/performDelete"
import type { Venta } from "@/types/ventas"
const VentasModal = dynamic(() => import('@/components/ventas/VentasModal'), { ssr: false })
const VentasDetailModal = dynamic(() => import('@/components/ventas/VentasDetailModal'), { ssr: false })
import Link from "next/link"

export default function VentasPageContent() {
    const router = useRouter()

    const [ventas, setVentas] = useState<Venta[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [detailVentaId, setDetailVentaId] = useState<string | null>(null)
    const [showDetailModal, setShowDetailModal] = useState(false)

    const filteredVentas = ventas.filter((venta) => venta.cliente.toLowerCase().includes(searchTerm.toLowerCase()))

    const fetchVentas = async () => {
        setError("")
        fetchData(getVentas, setVentas, "ventas", setLoading)
    }

    useEffect(() => {
        fetchVentas()
    }, [])

    const handleDelete = async (id_venta: string) => {
        await performDelete(deleteVenta, id_venta, fetchVentas, { confirmMessage: "¿Estas seguro de que quieres eliminar esta venta ?" })
    }
    return (
        <div className="min-h-screen bg-background p-6">
            <div className="mb-8 bg-gradient-to-r from-[#5e2129] via-[#7d2b35] to-[#8b7355] p-8 rounded-2xl shadow-xl animate-in slide-in-from-top duration-300">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href='/'
                            className="bg-white/20 p-3 rounded-xl backdrop-blur-sm hover:bg-white/30 transition-all hover:scale-105"
                        >
                            <ArrowLeft className="w-6 h-6 text-white" />
                        </Link>
                        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                            <DollarSign className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white">Gestión de Ventas</h1>
                            <p className="text-white/90 mt-1">Administra y registra tus ventas</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-white text-[#5e2129] px-6 py-3 rounded-xl font-semibold hover:bg-white/90 hover:scale-105 transition-all flex items-center gap-2 shadow-lg whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5" />
                        Nueva venta
                    </button>
                </div>
            </div>

            <div className="mb-8 bg-card p-4 rounded-xl shadow-lg border border-border">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre del cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e2129] dark:focus:ring-[#d4a574] transition-all text-foreground"
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5e2129] dark:border-[#d4a574] mx-auto"></div>
                    <p className="text-muted-foreground mt-4">Cargando ventas...</p>
                </div>
            ) : filteredVentas.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-xl border border-border shadow-lg">
                    <div className="bg-[#5e2129]/10 dark:bg-[#d4a574]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingCart className="w-10 h-10 text-[#5e2129] dark:text-[#d4a574]" />
                    </div>
                    <p className="text-xl text-foreground font-semibold mb-2">
                        {searchTerm ? "No se encontraron ventas" : "No hay ventas registradas"}
                    </p>
                    <p className="text-muted-foreground mb-4">
                        {searchTerm ? "Intenta con otro término de búsqueda" : "Comienza registrando tu primera venta"}
                    </p>

                    {!searchTerm && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-gradient-to-r from-[#5e2129] to-[#8b7355] text-white px-6 py-3 rounded-lg hover:from-[#7d2b35] hover:to-[#9d8565] transition-all hover:scale-105 shadow-lg"
                        >
                            Registrar primera venta
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVentas.map((venta) => (
                        <div
                            key={venta.id_venta}
                            className="bg-card p-6 rounded-xl shadow-lg border border-border hover:shadow-2xl hover:scale-[1.02] transition-all group animate-in fade-in duration-200"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-card-foreground group-hover:text-[#5e2129] dark:group-hover:text-[#d4a574] transition-colors">
                                        {venta.cliente}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {new Date(venta.fecha_venta).toLocaleDateString("es-MX", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                                <div className="bg-[#5e2129]/10 dark:bg-[#d4a574]/10 p-3 rounded-xl group-hover:scale-110 transition-transform">
                                    <ShoppingCart className="w-6 h-6 text-[#5e2129] dark:text-[#d4a574]" />
                                </div>
                            </div>

                            <div className="mb-4 p-4 bg-gradient-to-r from-[#5e2129]/10 to-[#d4a574]/10 dark:from-[#5e2129]/20 dark:to-[#d4a574]/20 rounded-lg border border-[#5e2129]/20 dark:border-[#d4a574]/20">
                                <p className="text-sm text-muted-foreground mb-1">Total</p>
                                <p className="text-3xl font-bold text-[#5e2129] dark:text-[#d4a574]">
                                    ${Number(venta.total).toFixed(2)}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => { setDetailVentaId(venta.id_venta); setShowDetailModal(true) }}
                                    className="flex-1 bg-gradient-to-r from-[#5e2129] to-[#7d2b35] text-white px-4 py-2.5 rounded-lg hover:from-[#7d2b35] hover:to-[#8b3d47] transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-md"
                                >
                                    <Eye className="w-4 h-4" />
                                    Ver
                                </button>
                                <button
                                    onClick={() => handleDelete(venta.id_venta)}
                                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2.5 rounded-lg hover:from-red-600 hover:to-red-700 transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-md"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <VentasModal
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        fetchVentas()
                        setShowModal(false)
                    }}
                />
            )}
            {showDetailModal && detailVentaId && (
                <VentasDetailModal
                    ventaId={detailVentaId}
                    onClose={() => { setShowDetailModal(false); setDetailVentaId(null); }}
                />
            )}
        </div>
    )
}