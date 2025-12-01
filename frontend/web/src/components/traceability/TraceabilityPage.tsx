"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus, Search, Edit, Trash2, Grape, Package, Settings, ClipboardCheck, Wine, Droplet, ArrowLeft } from "lucide-react"
import Link from "next/link"
import dynamic from 'next/dynamic'
const CosechaModal = dynamic(() => import('@/components/traceability/CosechaModal'), { ssr: false })
const LoteModal = dynamic(() => import('@/components/traceability/LoteModal'), { ssr: false })
const ProcesoProduccionModal = dynamic(() => import('@/components/traceability/ProcesoProduccionModal'), { ssr: false })
const ControlCalidadModal = dynamic(() => import('@/components/traceability/ControlCalidadModal'), { ssr: false })
import { getLotes, getControlCalidad, getCosechas, getProcesosProduccion, deleteControlCalidad, deleteCosecha, deleteLote, deleteProcesoProduccion } from "@/services/TraceabilityService"
import { fetchData } from "@/lib/fetchData"
import { performDelete } from "@/lib/performDelete"


type TabType = "cosechas" | "lotes" | "procesos" | "controles"

export default function TraceabilityPageComponent() {
    const [activeTab, setActiveTab] = useState<TabType>("cosechas")
    const [searchTerm, setSearchTerm] = useState("")
    const [cosechas, setCosechas] = useState<any[]>([])
    const [lotes, setLotes] = useState<any[]>([])
    const [procesos, setProcesos] = useState<any[]>([])
    const [controles, setControles] = useState<any[]>([])

    // Modal states
    const [cosechaModalOpen, setCosechaModalOpen] = useState(false)
    const [loteModalOpen, setLoteModalOpen] = useState(false)
    const [procesoModalOpen, setProcesoModalOpen] = useState(false)
    const [controlModalOpen, setControlModalOpen] = useState(false)

    // Editing items
    const [editingItem, setEditingItem] = useState<any>(null)

    useEffect(() => {
        fetchData(getLotes, setLotes, "Lotes");
        fetchData(getCosechas, setCosechas, "Cosechas");
        fetchData(getControlCalidad, setControles, "Controles");
        fetchData(getProcesosProduccion, setProcesos, "Procesos");
    }, []);

    const handleCreate = (type: TabType) => {
        setEditingItem(null)
        if (type === "cosechas") setCosechaModalOpen(true)
        if (type === "lotes") setLoteModalOpen(true)
        if (type === "procesos") setProcesoModalOpen(true)
        if (type === "controles") setControlModalOpen(true)
    }

    const handleEdit = (item: any, type: TabType) => {
        setEditingItem(item)
        if (type === "cosechas") setCosechaModalOpen(true)
        if (type === "lotes") setLoteModalOpen(true)
        if (type === "procesos") setProcesoModalOpen(true)
        if (type === "controles") setControlModalOpen(true)
    }

    const handleDelete = async (item: any, type: TabType) => {
        switch (type) {
            case "cosechas":
                await performDelete(deleteCosecha, item.id_cosecha, () => fetchData(getCosechas, setCosechas, "Cosechas"), { confirmMessage: "¿Estás seguro de eliminar este registro?" })
                break
            case "lotes":
                await performDelete(deleteLote, item.id_lote, () => fetchData(getLotes, setLotes, "Lotes"), { confirmMessage: "¿Estás seguro de eliminar este registro?" })
                break
            case "procesos":
                await performDelete(deleteProcesoProduccion, item.id_proceso, () => fetchData(getProcesosProduccion, setProcesos, "Procesos"), { confirmMessage: "¿Estás seguro de eliminar este registro?" })
                break
            case "controles":
                await performDelete(deleteControlCalidad, item.id_control, () => fetchData(getControlCalidad, setControles, "Controles"), { confirmMessage: "¿Estás seguro de eliminar este registro?" })
                break
        }
    }

    const tabs = [
        { id: "cosechas" as TabType, label: "Cosechas", icon: Grape, color: "from-purple-600 to-pink-600" },
        { id: "lotes" as TabType, label: "Lotes", icon: Package, color: "from-blue-600 to-cyan-600" },
        { id: "procesos" as TabType, label: "Procesos", icon: Settings, color: "from-orange-600 to-red-600" },
        {
            id: "controles" as TabType,
            label: "Control de Calidad",
            icon: ClipboardCheck,
            color: "from-green-600 to-emerald-600",
        },
    ]

    const getActiveData = () => {
        switch (activeTab) {
            case "cosechas":
                return cosechas
            case "lotes":
                return lotes
            case "procesos":
                return procesos
            case "controles":
                return controles
            default:
                return []
        }
    }

    const filteredData = getActiveData().filter((item: any) => {
        const searchLower = searchTerm.toLowerCase()
        return JSON.stringify(item).toLowerCase().includes(searchLower)
    })

    const stats = [
        { label: "Total Cosechas", value: cosechas.length, icon: Grape, gradient: "from-purple-500 to-pink-500" },
        { label: "Total Lotes", value: lotes.length, icon: Package, gradient: "from-blue-500 to-cyan-500" },
        {
            label: "Procesos Activos",
            value: procesos.filter((p: any) => !p.fecha_fin).length,
            icon: Settings,
            gradient: "from-orange-500 to-red-500",
        },
        {
            label: "Controles Realizados",
            value: controles.length,
            icon: ClipboardCheck,
            gradient: "from-green-500 to-emerald-500",
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-muted/40">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary via-primary/90 to-accent p-4 md:p-6 shadow-2xl border-b border-primary/30">
                <div className="container mx-auto">
                    <Link href="/">
                        <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/20 mb-4 font-semibold">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver al Panel
                        </Button>
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                                <Wine className="h-8 w-8 md:h-10 md:w-10" />
                                Trazabilidad
                            </h1>
                            <p className="text-sm md:text-base text-white/95 font-medium">Gestión completa del proceso de producción</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                    {stats.map((stat, index) => (
                        <Card
                            key={index}
                            className="p-4 md:p-6 hover:shadow-2xl transition-all duration-300 border-2 border-border hover:border-primary/50 bg-card hover:scale-[1.02]"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                                    <p className="text-2xl md:text-4xl font-bold text-foreground mt-2">{stat.value}</p>
                                </div>
                                <div className="p-2 md:p-3 rounded-lg bg-primary/10 border border-primary/30">
                                    <stat.icon className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {tabs.map((tab) => (
                        <Button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            variant={activeTab === tab.id ? "default" : "outline"}
                            className={`flex items-center gap-2 transition-all duration-300 border-2 font-bold text-sm md:text-base ${activeTab === tab.id
                                ? "bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02]"
                                : "border-border hover:bg-secondary hover:text-secondary-foreground hover:scale-[1.02]"
                                }`}
                        >
                            <tab.icon className="h-4 w-4 md:h-5 md:w-5" />
                            {tab.label}
                        </Button>
                    ))}
                </div>

                {/* Search and Create */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 md:h-5 md:w-5" />
                        <Input
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-card border-2 focus:border-primary font-medium text-sm md:text-base"
                        />
                    </div>
                    <Button
                        onClick={() => handleCreate(activeTab)}
                        className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-2xl transition-all duration-300 font-bold border-2 border-primary/30 text-sm md:text-base"
                    >
                        <Plus className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                        Crear Nuevo
                    </Button>
                </div>

                {/* Table */}
                <Card className="overflow-hidden border-2 border-border shadow-lg">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                                <tr>
                                    {activeTab === "cosechas" && (
                                        <>
                                            <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold">Año</th>
                                            <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold">Viñedo</th>
                                            <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold">Cantidad (kg)</th>
                                            <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold">Fecha Cosecha</th>
                                            <th className="px-4 md:px-6 py-3 md:py-4 text-right text-xs md:text-sm font-bold">Acciones</th>
                                        </>
                                    )}
                                    {activeTab === "lotes" && (
                                        <>
                                            <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold">Número Lote</th>
                                            <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold">Vino</th>
                                            <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold">Cantidad Botellas</th>
                                            <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold">Fecha Embotellado</th>
                                            <th className="px-4 md:px-6 py-3 md:py-4 text-right text-xs md:text-sm font-bold">Acciones</th>
                                        </>
                                    )}
                                    {activeTab === "procesos" && (
                                        <>
                                            <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold">Nombre Proceso</th>
                                            <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold">Lote</th>
                                            <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold">Fecha Inicio</th>
                                            <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold">Estado</th>
                                            <th className="px-4 md:px-6 py-3 md:py-4 text-right text-xs md:text-sm font-bold">Acciones</th>
                                        </>
                                    )}
                                    {activeTab === "controles" && (
                                        <>
                                            <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold">Tipo Control</th>
                                            <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold">Proceso</th>
                                            <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold">Fecha Análisis</th>
                                            <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold">Resultados</th>
                                            <th className="px-4 md:px-6 py-3 md:py-4 text-right text-xs md:text-sm font-bold">Acciones</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border bg-card">
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 md:px-6 py-8 md:py-12 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center gap-3">
                                                <Droplet className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground/50" />
                                                <p className="text-sm md:text-lg">No hay registros disponibles</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((item: any, index: number) => (
                                        <tr key={index} className="hover:bg-muted/50 transition-colors duration-200">
                                            {activeTab === "cosechas" && (
                                                <>
                                                    <td className="px-4 md:px-6 py-3 md:py-4 font-medium text-foreground text-sm md:text-base">{item.anio}</td>
                                                    <td className="px-4 md:px-6 py-3 md:py-4 text-muted-foreground text-sm md:text-base">{item.Vinedo?.nombre || "N/A"}</td>
                                                    <td className="px-4 md:px-6 py-3 md:py-4 text-muted-foreground text-sm md:text-base">{item.cantidad_kg}</td>
                                                    <td className="px-4 md:px-6 py-3 md:py-4 text-muted-foreground text-sm md:text-base">
                                                        {new Date(item.fecha_cosecha).toLocaleDateString()}
                                                    </td>
                                                </>
                                            )}
                                            {activeTab === "lotes" && (
                                                <>
                                                    <td className="px-4 md:px-6 py-3 md:py-4 font-medium text-foreground text-sm md:text-base">{item.numero_lote}</td>
                                                    <td className="px-4 md:px-6 py-3 md:py-4 text-muted-foreground text-sm md:text-base">{item.Vino?.nombre || "N/A"}</td>
                                                    <td className="px-4 md:px-6 py-3 md:py-4 text-muted-foreground text-sm md:text-base">{item.cantidad_botellas}</td>
                                                    <td className="px-4 md:px-6 py-3 md:py-4 text-muted-foreground text-sm md:text-base">
                                                        {new Date(item.fecha_embotellado).toLocaleDateString()}
                                                    </td>
                                                </>
                                            )}
                                            {activeTab === "procesos" && (
                                                <>
                                                    <td className="px-4 md:px-6 py-3 md:py-4 font-medium text-foreground text-sm md:text-base">{item.nombre_proceso}</td>
                                                    <td className="px-4 md:px-6 py-3 md:py-4 text-muted-foreground text-sm md:text-base">{item.Lote?.numero_lote || "N/A"}</td>
                                                    <td className="px-4 md:px-6 py-3 md:py-4 text-muted-foreground text-sm md:text-base">
                                                        {new Date(item.fecha_inicio).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 md:px-6 py-3 md:py-4">
                                                        <span
                                                            className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${item.fecha_fin
                                                                ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                                                                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                                                }`}
                                                        >
                                                            {item.fecha_fin ? "Finalizado" : "En Proceso"}
                                                        </span>
                                                    </td>
                                                </>
                                            )}
                                            {activeTab === "controles" && (
                                                <>
                                                    <td className="px-4 md:px-6 py-3 md:py-4 font-medium text-foreground text-sm md:text-base">{item.tipo_control}</td>
                                                    <td className="px-4 md:px-6 py-3 md:py-4 text-muted-foreground text-sm md:text-base">
                                                        {item.Proceso_Produccion?.nombre_proceso || "N/A"}
                                                    </td>
                                                    <td className="px-4 md:px-6 py-3 md:py-4 text-muted-foreground text-sm md:text-base">
                                                        {new Date(item.fecha_analisis).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 md:px-6 py-3 md:py-4 text-muted-foreground text-sm md:text-base">{item.resultados || "Sin resultados"}</td>
                                                </>
                                            )}
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEdit(item, activeTab)}
                                                        className="hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400"
                                                    >
                                                        <Edit className="h-3 w-3 md:h-4 md:w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(item, activeTab)}
                                                        className="hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
                                                    >
                                                        <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* Modals */}
            <CosechaModal
                isOpen={cosechaModalOpen}
                onClose={() => {
                    setCosechaModalOpen(false)
                    setEditingItem(null)
                }}
                onSuccess={() => fetchData(getCosechas, setCosechas, "Cosechas")}
                cosecha={editingItem}
            />
            <LoteModal
                isOpen={loteModalOpen}
                onClose={() => {
                    setLoteModalOpen(false)
                    setEditingItem(null)
                }}
                onSuccess={() => fetchData(getLotes, setLotes, "Lotes")}
                lote={editingItem}
            />
            <ProcesoProduccionModal
                isOpen={procesoModalOpen}
                onClose={() => {
                    setProcesoModalOpen(false)
                    setEditingItem(null)
                }}
                onSuccess={() => fetchData(getProcesosProduccion, setProcesos, "Procesos")}
                proceso={editingItem}
            />
            <ControlCalidadModal
                isOpen={controlModalOpen}
                onClose={() => {
                    setControlModalOpen(false)
                    setEditingItem(null)
                }}
                onSuccess={() => fetchData(getControlCalidad, setControles, "Controles")}
                control={editingItem}
            />
        </div>
    )
}