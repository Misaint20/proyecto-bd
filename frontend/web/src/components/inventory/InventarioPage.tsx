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
import { getVinedos, getVarietales, getBarricas, getMezclasVino, deleteBarrica, deleteMezclaVino, deleteVinedo, deleteVarietal } from "@/services/MastersService";
import { getInventario, deleteInventario } from "@/services/InventoryService";

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
            console.error(`Error inesperado al intentar obtener ${dataName}:`, error);
            setter([]);
        }
    };

    useEffect(() => {
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

    const handleDelete = async (id: string, deleter: any) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este registro?")) {
            return
        }

        const result = await deleter(id)

        if (result && result.success) {
            fetchData(getInventario, setInventarios, "Inventario")
        } else if (result) {
            console.error("Error al eliminar:", result.errorMessage)
        } else {
            console.error("Error: No se pudo obtener respuesta del servicio al eliminar.")
        }
    }

    const tabs = [
        { id: "vinedos", label: "Viñedos", icon: Grape, count: vinedos.length },
        { id: "varietales", label: "Varietales", icon: Wine, count: varietales.length },
        { id: "barricas", label: "Barricas", icon: Warehouse, count: barricas.length },
        { id: "inventario", label: "Inventario", icon: Package, count: inventarios.length },
        { id: "mezclas", label: "Mezclas", icon: Droplets, count: mezclas.length },
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
                                <Package className="h-8 w-8 md:h-10 md:w-10" />
                                Gestión de Inventario
                            </h1>
                            <p className="text-sm md:text-base text-white/95 font-medium">
                                Administra viñedos, varietales, barricas e inventario
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 mb-6 md:mb-8">
                    <Card className="p-4 md:p-6 bg-card hover:shadow-2xl transition-all duration-300 border-2 border-border hover:border-primary/50 hover:scale-[1.02]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wide">Viñedos</p>
                                <p className="text-2xl md:text-4xl font-bold mt-1 text-foreground">{vinedos.length}</p>
                            </div>
                            <div className="p-2 md:p-3 rounded-lg bg-primary/10 border border-primary/30">
                                <Grape className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 md:p-6 bg-card hover:shadow-2xl transition-all duration-300 border-2 border-border hover:border-accent/50 hover:scale-[1.02]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wide">Varietales</p>
                                <p className="text-2xl md:text-4xl font-bold mt-1 text-foreground">{varietales.length}</p>
                            </div>
                            <div className="p-2 md:p-3 rounded-lg bg-accent/20 border border-accent/30">
                                <Wine className="h-6 w-6 md:h-8 md:w-8 text-accent-foreground" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 md:p-6 bg-card hover:shadow-2xl transition-all duration-300 border-2 border-border hover:border-secondary/50 hover:scale-[1.02]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wide">Barricas</p>
                                <p className="text-2xl md:text-4xl font-bold mt-1 text-foreground">{barricas.length}</p>
                            </div>
                            <div className="p-2 md:p-3 rounded-lg bg-secondary/50 border border-secondary/30">
                                <Warehouse className="h-6 w-6 md:h-8 md:w-8 text-secondary-foreground" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 md:p-6 bg-card hover:shadow-2xl transition-all duration-300 border-2 border-border hover:border-primary/50 hover:scale-[1.02]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wide">Botellas</p>
                                <p className="text-2xl md:text-4xl font-bold mt-1 text-foreground">
                                    {inventarios.reduce((acc, inv) => acc + inv.Lote.cantidad_botellas, 0)}
                                </p>
                            </div>
                            <div className="p-2 md:p-3 rounded-lg bg-primary/10 border border-primary/30">
                                <Package className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 md:p-6 bg-card hover:shadow-2xl transition-all duration-300 border-2 border-border hover:border-accent/50 hover:scale-[1.02]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wide">Mezclas</p>
                                <p className="text-2xl md:text-4xl font-bold mt-1 text-foreground">{mezclas.length}</p>
                            </div>
                            <div className="p-2 md:p-3 rounded-lg bg-accent/20 border border-accent/30">
                                <Droplets className="h-6 w-6 md:h-8 md:w-8 text-accent-foreground" />
                            </div>
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
                                className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold transition-all duration-300 border-2 text-sm md:text-base ${activeTab === tab.id
                                    ? "bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02]"
                                    : "bg-card text-muted-foreground hover:bg-secondary hover:text-secondary-foreground border-border hover:scale-[1.02]"
                                    }`}
                            >
                                <Icon className="h-4 w-4 md:h-5 md:w-5" />
                                {tab.label}
                                <Badge variant={activeTab === tab.id ? "secondary" : "outline"} className="ml-2 font-bold text-xs">
                                    {tab.count}
                                </Badge>
                            </button>
                        )
                    })}
                </div>

                {/* Search and Create */}
                <Card className="p-4 md:p-6 mb-6 bg-card border-2 border-border">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                            <Input
                                placeholder={`Buscar ${activeTab}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-background border-2 border-input focus:border-primary text-sm md:text-base"
                            />
                        </div>
                        <Button
                            onClick={() => handleCreate(activeTab)}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 w-full md:w-auto font-semibold text-sm md:text-base"
                        >
                            <Plus className="mr-2 h-4 w-4 md:h-5 md:w-5" />
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

                {/* Tables */}
                <Card className="overflow-hidden border-2 border-border shadow-lg">
                    {activeTab === "vinedos" && (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                                    <tr>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold">Nombre</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold">Ubicación</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold">Contacto</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold">Teléfono</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-right text-xs md:text-sm font-bold">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border bg-card">
                                    {vinedos.map((vinedo) => (
                                        <tr key={vinedo.id_vinedo} className="hover:bg-accent/50 transition-colors">
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <div className="flex items-center gap-2">
                                                    <Grape className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                                                    <span className="font-medium text-foreground text-sm md:text-base">{vinedo.nombre}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <div className="flex items-center gap-2 text-muted-foreground text-sm md:text-base">
                                                    <MapPin className="h-3 w-3 md:h-4 md:w-4" />
                                                    {vinedo.ubicacion}
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <div className="flex items-center gap-2 text-muted-foreground text-sm md:text-base">
                                                    <User className="h-3 w-3 md:h-4 md:w-4" />
                                                    {vinedo.contacto}
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <div className="flex items-center gap-2 text-muted-foreground text-sm md:text-base">
                                                    <Phone className="h-3 w-3 md:h-4 md:w-4" />
                                                    {vinedo.telefono || "N/A"}
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleEdit(vinedo, "vinedo")}
                                                        className="hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-600"
                                                    >
                                                        <Edit className="h-3 w-3 md:h-4 md:w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => {
                                                            handleDelete(vinedo.id_vinedo, deleteVinedo)
                                                            fetchData(getVinedos, setVinedos, "Viñedos")
                                                        }}
                                                        className="hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600"
                                                    >
                                                        <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
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
                                <thead className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                                    <tr>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold">Nombre</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold">Descripción</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-right text-xs md:text-sm font-bold">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border bg-card">
                                    {varietales.map((varietal) => (
                                        <tr key={varietal.id_varietal} className="hover:bg-accent/50 transition-colors">
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <div className="flex items-center gap-2">
                                                    <Wine className="h-4 w-4 md:h-5 md:w-5 text-accent-foreground" />
                                                    <span className="font-medium text-foreground text-sm md:text-base">{varietal.nombre}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-3 md:py-4 text-muted-foreground text-sm md:text-base">{varietal.descripcion || "Sin descripción"}</td>
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleEdit(varietal, "varietal")}
                                                        className="hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-600"
                                                    >
                                                        <Edit className="h-3 w-3 md:h-4 md:w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => {
                                                            handleDelete(varietal.id_varietal, deleteVarietal)
                                                            fetchData(getVarietales, setVarietales, "Varietales")
                                                        }}
                                                        className="hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600"
                                                    >
                                                        <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
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
                                <thead className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                                    <tr>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold">Tipo de Madera</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold">Capacidad</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold">Fecha de Compra</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold">Costo</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-right text-xs md:text-sm font-bold">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border bg-card">
                                    {barricas.map((barrica) => (
                                        <tr key={barrica.id_barrica} className="hover:bg-accent/50 transition-colors">
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <div className="flex items-center gap-2">
                                                    <Warehouse className="h-4 w-4 md:h-5 md:w-5 text-secondary-foreground" />
                                                    <span className="font-medium text-foreground text-sm md:text-base">{barrica.tipo_madera}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <div className="flex items-center gap-2 text-muted-foreground text-sm md:text-base">
                                                    <Droplet className="h-3 w-3 md:h-4 md:w-4" />
                                                    {barrica.capacidad_litros}L
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <div className="flex items-center gap-2 text-muted-foreground text-sm md:text-base">
                                                    <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                                                    {new Date(barrica.fecha_compra).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <div className="flex items-center gap-2 text-muted-foreground text-sm md:text-base">
                                                    <DollarSign className="h-3 w-3 md:h-4 md:w-4" />${Number(barrica.costo).toFixed(2)}
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleEdit(barrica, "barrica")}
                                                        className="hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-600"
                                                    >
                                                        <Edit className="h-3 w-3 md:h-4 md:w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => {
                                                            handleDelete(barrica.id_barrica, deleteBarrica)
                                                            fetchData(getBarricas, setBarricas, "Barricas")
                                                        }}
                                                        className="hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600"
                                                    >
                                                        <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
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
                                <thead className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                                    <tr>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold">Número de Lote</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold">Ubicación</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold">Cantidad de Botellas</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-right text-xs md:text-sm font-bold">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border bg-card">
                                    {inventarios.map((inventario) => (
                                        <tr key={inventario.id_inventario} className="hover:bg-accent/50 transition-colors">
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <Badge variant="outline" className="font-mono text-xs md:text-sm">
                                                    {inventario.Lote.numero_lote}
                                                </Badge>
                                            </td>
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                                                    <span className="font-medium text-foreground text-sm md:text-base">{inventario.ubicacion}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <div className="flex items-center gap-2">
                                                    <Package className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                                                    <span className="font-semibold text-foreground text-sm md:text-base">{inventario.Lote.cantidad_botellas}</span>
                                                    <span className="text-muted-foreground text-xs md:text-sm">botellas</span>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleEdit(inventario, "inventario")}
                                                        className="hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-600"
                                                    >
                                                        <Edit className="h-3 w-3 md:h-4 md:w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => {
                                                            handleDelete(inventario.id_inventario, deleteInventario)
                                                            fetchData(getInventario, setInventarios, "Inventario")
                                                        }}
                                                        className="hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600"
                                                    >
                                                        <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
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
                                <thead className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                                    <tr>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold">Vino</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold">Varietal</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold">Porcentaje</th>
                                        <th className="px-4 md:px-6 py-3 md:py-4 text-right text-xs md:text-sm font-bold">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border bg-card">
                                    {mezclas.map((mezcla) => (
                                        <tr key={mezcla.id_mezcla} className="hover:bg-accent/50 transition-colors">
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <Badge variant="outline" className="font-mono text-xs md:text-sm">
                                                    {mezcla.Vino.nombre}
                                                </Badge>
                                            </td>
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <Badge variant="outline" className="font-mono text-xs md:text-sm">
                                                    {mezcla.Varietal.nombre}
                                                </Badge>
                                            </td>
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <div className="flex items-center gap-2">
                                                    <Droplets className="h-4 w-4 md:h-5 md:w-5 text-accent-foreground" />
                                                    <span className="font-semibold text-foreground text-sm md:text-base">{mezcla.porcentaje}%</span>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleEdit(mezcla, "mezcla")}
                                                        className="hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-600"
                                                    >
                                                        <Edit className="h-3 w-3 md:h-4 md:w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => {
                                                            handleDelete(mezcla.id_mezcla, deleteMezclaVino)
                                                            fetchData(getMezclasVino, setMezclas, "Mezclas")
                                                        }}
                                                        className="hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600"
                                                    >
                                                        <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
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