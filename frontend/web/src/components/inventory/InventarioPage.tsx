"use client"

import { useState, useEffect } from "react";
import {
    ArrowLeft,
    Package,
    Wine,
    Warehouse,
    Grape,
    Plus,
    Search,
    Edit,
    Trash2,
    MapPin,
    Phone,
    User,
    Calendar,
    DollarSign,
    Droplet,
    Droplets,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import VinedoModal from "@/components/inventory/VinedoModal"
import VarietalModal from "@/components/inventory/VarietalModal"
import BarricaModal from "@/components/inventory/BarricaModal"
import InventarioModal from "@/components/inventory/InventarioModal"
import MezclaVinoModal from "@/components/inventory/MezclaVinoModal"
import { Vinedo, Varietal, Barrica, MezclaVino } from "@/types/masters"
import { Inventario } from "@/types/inventory";
import { getVinedos, getVarietales, getBarricas, getMezclasVino } from "@/services/MastersService";
import { getInventario } from "@/services/InventoryService";

export default function InventoryPage() {
    const [activeTab, setActiveTab] = useState<"vinedos" | "varietales" | "barricas" | "inventario" | "mezclas">(
        "vinedos",
    )
    const [searchTerm, setSearchTerm] = useState("")

    // Estados para modales
    const [vinedoModalOpen, setVinedoModalOpen] = useState(false)
    const [varietalModalOpen, setVarietalModalOpen] = useState(false)
    const [barricaModalOpen, setBarricaModalOpen] = useState(false)
    const [inventarioModalOpen, setInventarioModalOpen] = useState(false)
    const [mezclaModalOpen, setMezclaModalOpen] = useState(false)

    const [editingItem, setEditingItem] = useState<any>(null)
    const [vinedos, setVinedos] = useState<Vinedo[]>([])
    const [varietales, setVarietales] = useState<Varietal[]>([])
    const [barricas, setBarricas] = useState<Barrica[]>([])
    const [inventarios, setInventarios] = useState<Inventario[]>([])
    const [mezclas, setMezclas] = useState<MezclaVino[]>([])

    const fetchData = async (apiCall: any, setter: any, dataName = "datos") => {
        try {
            const result = await apiCall();

            if (result && result.success) {
                setter(result.data.data);
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
        fetchData(getVinedos, setVinedos, "Viñedos");
        fetchData(getVarietales, setVarietales, "Varietales");
        fetchData(getBarricas, setBarricas, "Barricas");
        fetchData(getMezclasVino, setMezclas, "Mezclas");
        fetchData(getInventario, setInventarios, "Inventario");
    }, []);

    const handleEdit = (item: any, type: string) => {
        setEditingItem(item)
        if (type === "vinedo") setVinedoModalOpen(true)
        if (type === "varietal") setVarietalModalOpen(true)
        if (type === "barrica") setBarricaModalOpen(true)
        if (type === "inventario") setInventarioModalOpen(true)
        if (type === "mezcla") setMezclaModalOpen(true)
    }

    const handleCreate = (type: string) => {
        setEditingItem(null)
        if (type === "vinedos") setVinedoModalOpen(true)
        if (type === "varietales") setVarietalModalOpen(true)
        if (type === "barricas") setBarricaModalOpen(true)
        if (type === "inventario") setInventarioModalOpen(true)
        if (type === "mezclas") setMezclaModalOpen(true)
    }

    const tabs = [
        { id: "vinedos", label: "Viñedos", icon: Grape, count: vinedos.length },
        { id: "varietales", label: "Varietales", icon: Wine, count: varietales.length },
        { id: "barricas", label: "Barricas", icon: Warehouse, count: barricas.length },
        { id: "inventario", label: "Inventario", icon: Package, count: inventarios.length },
        { id: "mezclas", label: "Mezclas", icon: Droplets, count: mezclas.length },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white shadow-lg">
                <div className="container mx-auto px-6 py-8">
                    <Link href="/admin">
                        <Button variant="ghost" className="text-white hover:bg-white/20 mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver al Panel
                        </Button>
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                                <Package className="h-10 w-10" />
                                Gestión de Inventario
                            </h1>
                            <p className="text-green-100 text-lg">Administra viñedos, varietales, barricas e inventario</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                    <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Viñedos</p>
                                <p className="text-3xl font-bold mt-1">{vinedos.length}</p>
                            </div>
                            <Grape className="h-12 w-12 opacity-80" />
                        </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm font-medium">Varietales</p>
                                <p className="text-3xl font-bold mt-1">{varietales.length}</p>
                            </div>
                            <Wine className="h-12 w-12 opacity-80" />
                        </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-amber-100 text-sm font-medium">Barricas</p>
                                <p className="text-3xl font-bold mt-1">{barricas.length}</p>
                            </div>
                            <Warehouse className="h-12 w-12 opacity-80" />
                        </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Total Botellas</p>
                                <p className="text-3xl font-bold mt-1">
                                    {inventarios.reduce((acc, inv) => acc + inv.cantidad_botellas, 0)}
                                </p>
                            </div>
                            <Package className="h-12 w-12 opacity-80" />
                        </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-rose-500 to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-rose-100 text-sm font-medium">Mezclas</p>
                                <p className="text-3xl font-bold mt-1">{mezclas.length}</p>
                            </div>
                            <Droplets className="h-12 w-12 opacity-80" />
                        </div>
                    </Card>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${activeTab === tab.id
                                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-105"
                                    : "bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                                {tab.label}
                                <Badge variant="secondary" className="ml-2">
                                    {tab.count}
                                </Badge>
                            </button>
                        )
                    })}
                </div>

                {/* Search and Create */}
                <Card className="p-6 mb-6 bg-card/50 backdrop-blur border-border/50">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder={`Buscar ${activeTab}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-background border-border focus:border-green-500 focus:ring-green-500"
                            />
                        </div>
                        <Button
                            onClick={() => handleCreate(activeTab)}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 w-full md:w-auto"
                        >
                            <Plus className="mr-2 h-5 w-5" />
                            Crear{" "}
                            {activeTab === "vinedos"
                                ? "Viñedo"
                                : activeTab === "varietales"
                                    ? "Varietal"
                                    : activeTab === "barricas"
                                        ? "Barrica"
                                        : activeTab === "mezclas"
                                            ? "Mezcla"
                                            : "Inventario"}
                        </Button>
                    </div>
                </Card>

                {/* Content Tables */}
                <Card className="overflow-hidden border-border/50 shadow-lg">
                    {/* Viñedos Table */}
                    {activeTab === "vinedos" && (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Nombre</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Ubicación</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Contacto</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Teléfono</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {vinedos.map((vinedo, index) => (
                                        <tr key={vinedo.id_vinedo} className="hover:bg-accent/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Grape className="h-5 w-5 text-green-600" />
                                                    <span className="font-medium text-foreground">{vinedo.nombre}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <MapPin className="h-4 w-4" />
                                                    {vinedo.ubicacion}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <User className="h-4 w-4" />
                                                    {vinedo.contacto}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Phone className="h-4 w-4" />
                                                    {vinedo.telefono || "N/A"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleEdit(vinedo, "vinedo")}
                                                        className="hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-600"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Varietales Table */}
                    {activeTab === "varietales" && (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Nombre</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Descripción</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {varietales.map((varietal) => (
                                        <tr key={varietal.id_varietal} className="hover:bg-accent/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Wine className="h-5 w-5 text-purple-600" />
                                                    <span className="font-medium text-foreground">{varietal.nombre}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">{varietal.descripcion || "Sin descripción"}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleEdit(varietal, "varietal")}
                                                        className="hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-600"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Barricas Table */}
                    {activeTab === "barricas" && (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Tipo de Madera</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Capacidad</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Fecha de Compra</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Costo</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {barricas.map((barrica) => (
                                        <tr key={barrica.id_barrica} className="hover:bg-accent/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Warehouse className="h-5 w-5 text-amber-600" />
                                                    <span className="font-medium text-foreground">{barrica.tipo_madera}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Droplet className="h-4 w-4" />
                                                    {barrica.capacidad_litros}L
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Calendar className="h-4 w-4" />
                                                    {new Date(barrica.fecha_compra).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <DollarSign className="h-4 w-4" />{barrica.costo}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleEdit(barrica, "barrica")}
                                                        className="hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-600"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Inventario Table */}
                    {activeTab === "inventario" && (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Número de Lote</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Ubicación</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Cantidad de Botellas</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {inventarios.map((inventario) => (
                                        <tr key={inventario.id_inventario} className="hover:bg-accent/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className="font-mono">
                                                    {inventario.Lote.numero_lote}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-5 w-5 text-blue-600" />
                                                    <span className="font-medium text-foreground">{inventario.ubicacion}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Package className="h-5 w-5 text-muted-foreground" />
                                                    <span className="font-semibold text-foreground">{inventario.cantidad_botellas}</span>
                                                    <span className="text-muted-foreground text-sm">botellas</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleEdit(inventario, "inventario")}
                                                        className="hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-600"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Mezclas Table */}
                    {activeTab === "mezclas" && (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Vino</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Varietal</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Porcentaje</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {mezclas.map((mezcla) => (
                                        <tr key={mezcla.id_mezcla} className="hover:bg-accent/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className="font-mono">
                                                    {mezcla.Vino.nombre}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className="font-mono">
                                                    {mezcla.Varietal.nombre}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Droplets className="h-5 w-5 text-purple-600" />
                                                    <span className="font-semibold text-foreground">{mezcla.porcentaje}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleEdit(mezcla, "mezcla")}
                                                        className="hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-600"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>

            {/* Modals */}
            <VinedoModal
                open={vinedoModalOpen}
                onClose={() => {
                    setVinedoModalOpen(false)
                    setEditingItem(null)
                }}
                vinedo={editingItem}
                onSuccess={() => {
                    fetchData(getVinedos, setVinedos, "Viñedos")
                }}
            />

            <VarietalModal
                open={varietalModalOpen}
                onClose={() => {
                    setVarietalModalOpen(false)
                    setEditingItem(null)
                }}
                varietal={editingItem}
                onSuccess={() => {
                    fetchData(getVarietales, setVarietales, "Varietales")
                }}
            />

            <BarricaModal
                open={barricaModalOpen}
                onClose={() => {
                    setBarricaModalOpen(false)
                    setEditingItem(null)
                }}
                barrica={editingItem}
                onSuccess={() => {
                    fetchData(getBarricas, setBarricas, "Barricas")
                }}
            />

            <InventarioModal
                open={inventarioModalOpen}
                onClose={() => {
                    setInventarioModalOpen(false)
                    setEditingItem(null)
                }}
                inventario={editingItem}
                onSuccess={() => {
                    fetchData(getInventario, setInventarios, "Inventario")
                }}
            />

            <MezclaVinoModal
                open={mezclaModalOpen}
                onClose={() => {
                    setMezclaModalOpen(false)
                    setEditingItem(null)
                }}
                mezcla={editingItem}
                onSuccess={() => {
                    fetchData(getMezclasVino, setMezclas, "Mezclas")
                }}
            />
        </div>
    )
}
