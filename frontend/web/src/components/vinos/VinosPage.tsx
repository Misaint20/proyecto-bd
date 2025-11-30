"use client"

import { useState, useEffect } from "react"
import { Wine, Plus, Search, Edit, Trash2, ArrowLeft, Package, DollarSign, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import dynamic from 'next/dynamic'
const VinoModal = dynamic(() => import('@/components/vinos/VinosModal'), { ssr: false })
import { getVinos, deleteVino } from "@/services/VinosService"
import { getInventario } from "@/services/InventoryService"
import { fetchData } from "@/lib/fetchData"
import { performDelete } from "@/lib/performDelete"
import type { Vino } from "@/types/vino"

export default function VinosPageContent() {
    const router = useRouter()
    const [vinos, setVinos] = useState<Vino[]>([])
    const [inventario, setInventario] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [editingVino, setEditingVino] = useState<Vino | null>(null)

    const filteredVinos = vinos.filter(
        (vino) =>
            vino.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vino.tipo.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    useEffect(() => {
        // Llama a la función genérica con la función de API y la función de estado correspondiente.
        fetchData(getVinos, setVinos, "Vinos", setLoading);
        fetchData(getInventario, setInventario, "Inventario");
    }, []);


    const handleDelete = async (id_vino: string) => {
        await performDelete(deleteVino, id_vino, () => fetchData(getVinos, setVinos, "Vinos"), {
            confirmMessage: "¿Estás seguro de que quieres eliminar este vino?",
        })
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="mb-8 bg-gradient-to-r from-primary via-accent to-primary p-8 rounded-2xl shadow-xl border-2 border-primary/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push("/admin")}
                            className="bg-white/20 p-3 rounded-xl backdrop-blur-sm hover:bg-white/30 transition-all hover:scale-105 border border-white/30"
                        >
                            <ArrowLeft className="w-6 h-6 text-white" />
                        </button>
                        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/30">
                            <Wine className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white">Gestión de Vinos</h1>
                            <p className="text-white/90 mt-1 font-medium">Administra tu catálogo de vinos</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setEditingVino(null)
                            setShowModal(true)
                        }}
                        className="bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:bg-white/90 hover:scale-105 transition-all flex items-center gap-2 shadow-lg border-2 border-white/50"
                    >
                        <Plus className="w-5 h-5" />
                        Nuevo Vino
                    </button>
                </div>
            </div>

            <div className="mb-8 bg-card p-4 rounded-xl shadow-lg border-2 border-border">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o tipo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-background border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all text-foreground font-medium"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3  gap-6 mb-8">
                <div className="bg-gradient-to-br from-primary to-primary/80 dark:from-primary dark:to-primary/90 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:scale-105 group border-2 border-primary/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-white/90 text-lg font-bold">Total Vinos</h3>
                            <p className="text-5xl font-bold text-white mt-2">{vinos.length}</p>
                        </div>
                        <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm group-hover:scale-110 transition-transform border border-white/30">
                            <Wine className="w-8 h-8 text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-secondary to-secondary/80 dark:from-secondary dark:to-secondary/90 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:scale-105 group border-2 border-secondary/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-white/90 text-lg font-bold">Botellas Totales</h3>
                            <p className="text-5xl font-bold text-white mt-2">
                                {inventario.reduce((acc, inv) => acc + inv.Lote.cantidad_botellas, 0)}
                            </p>
                        </div>
                        <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm group-hover:scale-110 transition-transform border border-white/30">
                            <Package className="w-8 h-8 text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-accent to-accent/80 dark:from-accent dark:to-accent/90 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:scale-105 group border-2 border-accent/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-white/90 text-lg font-bold">Valor Total</h3>
                            <p className="text-5xl font-bold text-white mt-2">
                                $
                                {vinos
                                    .reduce((acc, v) => acc + Number(v.precio_botella) * (inventario.reduce((acc, inv) => acc + inv.Lote.cantidad_botellas, 0)), 0)
                                    .toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm group-hover:scale-110 transition-transform border border-white/30">
                            <DollarSign className="w-8 h-8 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-4 font-medium">Cargando vinos...</p>
                </div>
            ) : filteredVinos.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-xl border-2 border-border shadow-lg">
                    <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/30">
                        <Wine className="w-10 h-10 text-primary" />
                    </div>
                    <p className="text-xl text-foreground font-bold mb-2">
                        {searchTerm ? "No se encontraron vinos" : "No hay vinos registrados"}
                    </p>
                    <p className="text-muted-foreground mb-4 font-medium">
                        {searchTerm ? "Intenta con otro término de búsqueda" : "Comienza agregando tu primer vino al catálogo"}
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-lg hover:from-primary/90 hover:to-accent/90 transition-all hover:scale-105 shadow-lg font-semibold border-2 border-primary/30"
                        >
                            Agregar primer vino
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVinos.map((vino) => (
                        <div
                            key={vino.id_vino}
                            className="bg-card p-6 rounded-xl shadow-lg border-2 border-border hover:shadow-2xl hover:scale-105 transition-all group hover:border-primary/50"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors">
                                        {vino.nombre}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/30">
                                            {vino.tipo}
                                        </span>
                                        <span className="text-muted-foreground text-sm font-medium">{vino.anio_cosecha}</span>
                                    </div>
                                </div>
                                <div className="bg-primary/10 p-3 rounded-xl group-hover:scale-110 transition-transform border border-primary/30">
                                    <Wine className="w-6 h-6 text-primary" />
                                </div>
                            </div>

                            {vino.meses_barrica && vino.meses_barrica > 0 && (
                                <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                                    <Sparkles className="w-4 h-4" />
                                    <span>{vino.meses_barrica} meses en barrica</span>
                                </div>
                            )}

                            {vino.descripcion && (
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{vino.descripcion}</p>
                            )}

                            <div className="flex justify-between items-center mb-4 p-3 bg-accent rounded-lg">
                                <div>
                                    <p className="text-2xl font-bold text-gray-250 dark:text-slate-300">
                                        ${Number(vino.precio_botella).toFixed(2)}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{vino.botellas_por_caja || 12} botellas/caja</p>
                                </div>
                                <Package className="w-8 h-8 text-muted-foreground" />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setEditingVino(vino)
                                        setShowModal(true)
                                    }}
                                    className="flex-1 bg-gradient-to-r from-secondary to-secondary/80 text-white px-4 py-2.5 rounded-lg hover:from-secondary/90 hover:to-secondary/70 transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-md font-semibold border border-secondary/30"
                                >
                                    <Edit className="w-4 h-4" />
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(vino.id_vino)}
                                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2.5 rounded-lg hover:from-red-700 hover:to-red-800 transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-md font-semibold border border-red-500/30"
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
                <VinoModal
                    vino={editingVino}
                    onClose={() => {
                        setShowModal(false)
                        setEditingVino(null)
                    }}
                    onSuccess={() => {
                        fetchData(getVinos, setVinos, "Vinos");
                        setShowModal(false)
                        setEditingVino(null)
                    }}
                />
            )}
        </div>
    )
}