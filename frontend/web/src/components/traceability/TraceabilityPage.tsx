"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus, Search, Edit, Trash2, Grape, Package, Settings, ClipboardCheck, Wine, Droplet, ArrowLeft } from "lucide-react"
import Link from "next/link"
import CosechaModal from "@/components/traceability/CosechaModal"
import LoteModal from "@/components/traceability/LoteModal"
import ProcesoProduccionModal from "@/components/traceability/ProcesoProduccionModal"
import ControlCalidadModal from "@/components/traceability/ControlCalidadModal"
import { getLotes, getControlCalidad, getCosechas, getProcesosProduccion, deleteControlCalidad, deleteCosecha, deleteLote, deleteProcesoProduccion } from "@/services/TraceabilityService"


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

    const fetchData = async (apiCall: any, setter: any, dataName = "datos") => {
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
    };

    useEffect(() => {
        // Llama a la función genérica con la función de API y la función de estado correspondiente.
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
        if (confirm("¿Estás seguro de eliminar este registro?")) {
            console.log("Deleting:", type, item)
            switch (type) {
                case "cosechas":
                    await deleteCosecha(item.id_cosecha)
                    break
                case "lotes":
                    await deleteLote(item.id_lote)
                    break
                case "procesos":
                    await deleteProcesoProduccion(item.id_proceso)
                    break
                case "controles":
                    await deleteControlCalidad(item.id_control)
                    break
            }
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
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white shadow-lg">
                <div className="container mx-auto px-6 py-8">
                    <Link href="/">
                        <Button variant="ghost" className="text-white hover:bg-white/20 mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver al Panel
                        </Button>
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                                <Wine className="h-10 w-10" />
                                Trazabilidad
                            </h1>
                            <p className="text-green-100 text-lg">Gestión completa del proceso de producción</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <Card
                            key={index}
                            className="p-6 hover:shadow-xl transition-all duration-300 border-2 hover:scale-105 cursor-pointer bg-card"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                                </div>
                                <div className={`p-4 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                                    <stat.icon className="h-8 w-8 text-white" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-3 mb-6">
                    {tabs.map((tab) => (
                        <Button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            variant={activeTab === tab.id ? "default" : "outline"}
                            className={`flex items-center gap-2 transition-all duration-300 ${activeTab === tab.id
                                ? `bg-gradient-to-r ${tab.color} text-white shadow-lg scale-105`
                                : "hover:scale-105"
                                }`}
                        >
                            <tab.icon className="h-5 w-5" />
                            {tab.label}
                        </Button>
                    ))}
                </div>

                {/* Search and Create */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-card border-2 focus:border-green-500"
                        />
                    </div>
                    <Button
                        onClick={() => handleCreate(activeTab)}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Crear Nuevo
                    </Button>
                </div>

                {/* Table */}
                <Card className="overflow-hidden border-2 shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                                <tr>
                                    {activeTab === "cosechas" && (
                                        <>
                                            <th className="px-6 py-4 text-left font-semibold">Año</th>
                                            <th className="px-6 py-4 text-left font-semibold">Viñedo</th>
                                            <th className="px-6 py-4 text-left font-semibold">Cantidad (kg)</th>
                                            <th className="px-6 py-4 text-left font-semibold">Fecha Cosecha</th>
                                            <th className="px-6 py-4 text-right font-semibold">Acciones</th>
                                        </>
                                    )}
                                    {activeTab === "lotes" && (
                                        <>
                                            <th className="px-6 py-4 text-left font-semibold">Número Lote</th>
                                            <th className="px-6 py-4 text-left font-semibold">Vino</th>
                                            <th className="px-6 py-4 text-left font-semibold">Cantidad Botellas</th>
                                            <th className="px-6 py-4 text-left font-semibold">Fecha Embotellado</th>
                                            <th className="px-6 py-4 text-right font-semibold">Acciones</th>
                                        </>
                                    )}
                                    {activeTab === "procesos" && (
                                        <>
                                            <th className="px-6 py-4 text-left font-semibold">Nombre Proceso</th>
                                            <th className="px-6 py-4 text-left font-semibold">Lote</th>
                                            <th className="px-6 py-4 text-left font-semibold">Fecha Inicio</th>
                                            <th className="px-6 py-4 text-left font-semibold">Estado</th>
                                            <th className="px-6 py-4 text-right font-semibold">Acciones</th>
                                        </>
                                    )}
                                    {activeTab === "controles" && (
                                        <>
                                            <th className="px-6 py-4 text-left font-semibold">Tipo Control</th>
                                            <th className="px-6 py-4 text-left font-semibold">Proceso</th>
                                            <th className="px-6 py-4 text-left font-semibold">Fecha Análisis</th>
                                            <th className="px-6 py-4 text-left font-semibold">Resultados</th>
                                            <th className="px-6 py-4 text-right font-semibold">Acciones</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center gap-3">
                                                <Droplet className="h-12 w-12 text-muted-foreground/50" />
                                                <p className="text-lg">No hay registros disponibles</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((item: any, index: number) => (
                                        <tr key={index} className="hover:bg-muted/50 transition-colors duration-200">
                                            {activeTab === "cosechas" && (
                                                <>
                                                    <td className="px-6 py-4 font-medium text-foreground">{item.anio}</td>
                                                    <td className="px-6 py-4 text-muted-foreground">{item.Vinedo?.nombre || "N/A"}</td>
                                                    <td className="px-6 py-4 text-muted-foreground">{item.cantidad_kg}</td>
                                                    <td className="px-6 py-4 text-muted-foreground">
                                                        {new Date(item.fecha_cosecha).toLocaleDateString()}
                                                    </td>
                                                </>
                                            )}
                                            {activeTab === "lotes" && (
                                                <>
                                                    <td className="px-6 py-4 font-medium text-foreground">{item.numero_lote}</td>
                                                    <td className="px-6 py-4 text-muted-foreground">{item.Vino?.nombre || "N/A"}</td>
                                                    <td className="px-6 py-4 text-muted-foreground">{item.cantidad_botellas}</td>
                                                    <td className="px-6 py-4 text-muted-foreground">
                                                        {new Date(item.fecha_embotellado).toLocaleDateString()}
                                                    </td>
                                                </>
                                            )}
                                            {activeTab === "procesos" && (
                                                <>
                                                    <td className="px-6 py-4 font-medium text-foreground">{item.nombre_proceso}</td>
                                                    <td className="px-6 py-4 text-muted-foreground">{item.Lote?.numero_lote || "N/A"}</td>
                                                    <td className="px-6 py-4 text-muted-foreground">
                                                        {new Date(item.fecha_inicio).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${item.fecha_fin
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
                                                    <td className="px-6 py-4 font-medium text-foreground">{item.tipo_control}</td>
                                                    <td className="px-6 py-4 text-muted-foreground">
                                                        {item.Proceso_Produccion?.nombre_proceso || "N/A"}
                                                    </td>
                                                    <td className="px-6 py-4 text-muted-foreground">
                                                        {new Date(item.fecha_analisis).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-muted-foreground">{item.resultados || "Sin resultados"}</td>
                                                </>
                                            )}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEdit(item, activeTab)}
                                                        className="hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(item, activeTab)}
                                                        className="hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
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
