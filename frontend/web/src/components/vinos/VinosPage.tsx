"use client"

import { useState, useEffect } from "react"
import { Wine, Plus, Search, Edit, Trash2, ArrowLeft, Package, DollarSign, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import VinoModal from "@/components/vinos/VinosModal"
import { getVinos, deleteVino } from "@/services/VinosService"
import { getInventario } from "@/services/InventoryService"
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

    const fetchData = async (apiCall: any, setter: any, dataName = "datos") => {
        setLoading(true)
        try {
            const result = await apiCall();

            if (result && result.success) {
                if (!result.data.data) setter(result.data);
                else setter(result.data.data);
            } else if (result) {
                console.error(`Error al obtener ${dataName}: ${result.errorMessage}`);
                setter([]);
            } else {
                console.error(`Error: No se pudo obtener respuesta del servicio para ${dataName}.`);
                setter([]);
            }
        } catch (error) {
            // Captura errores de red o errores lanzados por apiCall antes del manejo de la respuesta 'result'
            console.error(`Error inesperado al intentar obtener ${dataName}:`, error);
            setter([]);
        }
        setLoading(false)
    };

    useEffect(() => {
        // Llama a la función genérica con la función de API y la función de estado correspondiente.
        fetchData(getVinos, setVinos, "Vinos");
        fetchData(getInventario, setInventario, "Inventario");
    }, []);


    const handleDelete = async (id_vino: string) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este vino?")) {
            return
        }

        const result = await deleteVino(id_vino)

        if (result && result.success) {
            fetchData(getVinos, setVinos, "Vinos")
        } else if (result) {
            console.error("Error al eliminar:", result.errorMessage)
        } else {
            console.error("Error: No se pudo obtener respuesta del servicio al eliminar.")
        }
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="mb-8 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-8 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push("/admin")}
                            className="bg-white/20 p-3 rounded-xl backdrop-blur-sm hover:bg-white/30 transition-all hover:scale-105"
                        >
                            <ArrowLeft className="w-6 h-6 text-white" />
                        </button>
                        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                            <Wine className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white">Gestión de Vinos</h1>
                            <p className="text-white/90 mt-1">Administra tu catálogo de vinos</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setEditingVino(null)
                            setShowModal(true)
                        }}
                        className="bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-white/90 hover:scale-105 transition-all flex items-center gap-2 shadow-lg"
                    >
                        <Plus className="w-5 h-5" />
                        Nuevo Vino
                    </button>
                </div>
            </div>

            <div className="mb-8 bg-card p-4 rounded-xl shadow-lg border border-border">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o tipo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-foreground"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 group">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-white/90 text-lg font-semibold">Total Vinos</h3>
                            <p className="text-4xl font-bold text-white mt-2">{vinos.length}</p>
                        </div>
                        <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm group-hover:scale-110 transition-transform">
                            <Wine className="w-8 h-8 text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 group">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-white/90 text-lg font-semibold">Botellas Totales</h3>
                            <p className="text-4xl font-bold text-white mt-2">
                                {inventario.reduce((acc, inv) => acc + inv.Lote.cantidad_botellas, 0)}
                            </p>
                        </div>
                        <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm group-hover:scale-110 transition-transform">
                            <Package className="w-8 h-8 text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 group">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-white/90 text-lg font-semibold">Valor Total</h3>
                            <p className="text-4xl font-bold text-white mt-2">
                                $
                                {vinos
                                    .reduce((acc, v) => acc + Number(v.precio_botella) * (inventario.reduce((acc, inv) => acc + inv.Lote.cantidad_botellas, 0)), 0)
                                    .toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm group-hover:scale-110 transition-transform">
                            <DollarSign className="w-8 h-8 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                    <p className="text-muted-foreground mt-4">Cargando vinos...</p>
                </div>
            ) : filteredVinos.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-xl border border-border shadow-lg">
                    <div className="bg-green-100 dark:bg-green-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Wine className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-xl text-foreground font-semibold mb-2">
                        {searchTerm ? "No se encontraron vinos" : "No hay vinos registrados"}
                    </p>
                    <p className="text-muted-foreground mb-4">
                        {searchTerm ? "Intenta con otro término de búsqueda" : "Comienza agregando tu primer vino al catálogo"}
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all hover:scale-105 shadow-lg"
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
                            className="bg-card p-6 rounded-xl shadow-lg border border-border hover:shadow-2xl hover:scale-105 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-card-foreground group-hover:text-green-600 transition-colors">
                                        {vino.nombre}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                            {vino.tipo}
                                        </span>
                                        <span className="text-muted-foreground text-sm">{vino.anio_cosecha}</span>
                                    </div>
                                </div>
                                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl group-hover:scale-110 transition-transform">
                                    <Wine className="w-6 h-6 text-green-600 dark:text-green-400" />
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
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
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
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-md"
                                >
                                    <Edit className="w-4 h-4" />
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(vino.id_vino)}
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
                <VinoModal
                    vino={editingVino}
                    onClose={() => {
                        setShowModal(false)
                        setEditingVino(null)
                    }}
                    onSuccess={() => {
                        fetchData(getVinos, setVinos, "Vinos")
                        setShowModal(false)
                        setEditingVino(null)
                    }}
                />
            )}
        </div>
    )
}