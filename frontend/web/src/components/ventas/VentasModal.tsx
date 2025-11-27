"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ShoppingCart, Wine, Trash2, Plus, X, User, DollarSign } from "lucide-react"
import { type NewVentaData, createVenta } from "@/services/VentasService"
import { getInventario } from "@/services/InventoryService"
import type { ItemCarrito } from "@/types/ventas"
import type { Inventario } from "@/types/inventory"

interface VentasModalProps {
    onClose: () => void
    onSuccess: () => void
}

export default function VentasModal({ onClose, onSuccess }: VentasModalProps) {
    // Estados
    const [cliente, setCliente] = useState("")
    const [carrito, setCarrito] = useState<ItemCarrito[]>([])
    const [vinosDisponibles, setVinosDisponibles] = useState<Inventario[]>([])
    const [vinoSeleccionado, setVinoSeleccionado] = useState("")
    const [cantidad, setCantidad] = useState(1)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    // Cargar vinos al abrir el modal
    useEffect(() => {
        fetchVinosDisponibles()
    }, [])

    // Funcion para obtener la lista de vinos
    const fetchVinosDisponibles = async () => {
        const result = await getInventario()

        if (result && result.success) {
            setVinosDisponibles(result.data.data)
        } else {
            setError("Error al cargar los vinos")
        }
    }

    const agregarAlCarrito = () => {
        if (!vinoSeleccionado) {
            setError("Selecciona un vino")
            return
        }

        if (cantidad <= 0) {
            setError("La cantidad debe ser mayor a 0")
        }

        const inventario = vinosDisponibles.find((v) => v.Lote.Vino.id_vino === vinoSeleccionado)
        if (!inventario) {
            setError("Vino no encontrado")
            return
        }

        const subtotal = Number(inventario.Lote.Vino.precio_botella) * cantidad

        const nuevoItem: ItemCarrito = {
            id_vino: inventario.Lote.Vino.id_vino,
            id_lote: inventario.Lote.id_lote,
            nombreVino: inventario.Lote.Vino.nombre,
            precio_unitario: Number(inventario.Lote.Vino.precio_botella),
            cantidad: cantidad,
            subtotal: subtotal,
        }

        setCarrito([...carrito, nuevoItem])

        setVinoSeleccionado("")
        setCantidad(1)
        setError("")
    }

    const eliminarDelCarrito = (index: number) => {
        const nuevoCarrito = carrito.filter((_, i) => i !== index)
        setCarrito(nuevoCarrito)
    }

    const calcularTotal = () => {
        return carrito.reduce((total, item) => total + item.subtotal, 0)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (cliente.trim() === "") {
            setError("Ingresa el nombre del cliente")
            return
        }

        if (carrito.length === 0) {
            setError("Agrega un producto al carrito")
            return
        }

        setLoading(true)

        const ventaData: NewVentaData = {
            cliente: cliente.trim(),
            fecha_venta: new Date().toISOString(),
            detalles: carrito.map((item) => ({
                id_vino: item.id_vino,
                id_lote: item.id_lote,
                cantidad: item.cantidad,
            })),
        }

        const result = await createVenta(ventaData)

        setLoading(false)

        if (result && result.success) {
            onSuccess()
        } else {
            setError(result?.errorMessage || "Error al crear la venta")
        }
    }
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-card rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                <div className="bg-gradient-to-r from-[#5e2129] via-[#7d2b35] to-[#8b7355] p-6 rounded-t-2xl sticky top-0 z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                                <ShoppingCart className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Nueva venta</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-all hover:scale-110"
                            type="button"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center gap-2 animate-in slide-in-from-top duration-200">
                            <span className="font-semibold">Error:</span>
                            <span>{error}</span>
                        </div>
                    )}
                    <div>
                        <label className="text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                            <User className="w-4 h-4 text-[#5e2129] dark:text-[#d4a574]" />
                            Cliente *
                        </label>
                        <input
                            type="text"
                            required
                            value={cliente}
                            onChange={(e) => setCliente(e.target.value)}
                            placeholder="Nombre del cliente"
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e2129] dark:focus:ring-[#d4a574] transition-all text-foreground"
                        />
                    </div>
                    <div className="border border-border rounded-xl p-4 bg-accent/30">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-[#5e2129] dark:text-[#d4a574]" />
                            Agregar productos
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium mb-2 block text-foreground">Vino</label>
                                <select
                                    value={vinoSeleccionado}
                                    onChange={(e) => setVinoSeleccionado(e.target.value)}
                                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e2129] dark:focus:ring-[#d4a574] transition-all text-foreground"
                                >
                                    <option value="">Selecciona un vino...</option>
                                    {vinosDisponibles.map((vino) => (
                                        <option key={vino.Lote.Vino.id_vino} value={vino.Lote.Vino.id_vino}>
                                            {vino.Lote.Vino.nombre} - {vino.Lote.Vino.tipo} - ${vino.Lote.Vino.precio_botella}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block text-foreground">Cantidad</label>
                                <input
                                    type="number"
                                    min={1}
                                    value={cantidad}
                                    onChange={(e) => setCantidad(Number.parseInt(e.target.value) || 1)}
                                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e2129] dark:focus:ring-[#d4a574] transition-all text-foreground"
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={agregarAlCarrito}
                            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 text-white bg-gradient-to-r from-[#5e2129] to-[#8b7355] rounded-lg shadow-md hover:from-[#7d2b35] hover:to-[#9d8565] focus:outline-none focus:ring-2 focus:ring-[#5e2129] transition-all hover:scale-[1.02]"
                        >
                            <Plus className="w-5 h-5" />
                            Agregar al carrito
                        </button>
                    </div>
                    <div>
                        <div className="border border-border rounded-xl p-4 bg-card">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5 text-[#5e2129] dark:text-[#d4a574]" />
                                Carrito ({carrito.length} {carrito.length === 1 ? "producto" : "productos"})
                            </h3>
                            {carrito.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                    <p className="font-medium">El carrito está vacío</p>
                                    <p className="text-sm mt-1">Agrega productos para continuar</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {carrito.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 bg-accent/50 rounded-lg border border-border hover:shadow-md transition-all"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <Wine className="w-4 h-4 text-[#5e2129] dark:text-[#d4a574]" />
                                                    <h4 className="font-semibold text-foreground">{item.nombreVino}</h4>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {item.cantidad} × ${item.precio_unitario.toFixed(2)} =
                                                    <span className="font-semibold text-[#5e2129] dark:text-[#d4a574] ml-1">
                                                        ${item.subtotal.toFixed(2)}
                                                    </span>
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => eliminarDelCarrito(index)}
                                                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all hover:scale-110"
                                                title="Eliminar del carrito"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="mt-4 bg-gradient-to-r from-[#5e2129]/10 to-[#d4a574]/10 dark:from-[#5e2129]/20 dark:to-[#d4a574]/20 p-6 rounded-xl border-2 border-[#5e2129]/30 dark:border-[#d4a574]/30">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-6 h-6 text-[#5e2129] dark:text-[#d4a574]" />
                                    <span className="text-xl font-semibold text-foreground">Total:</span>
                                </div>
                                <span className="text-3xl font-bold text-[#5e2129] dark:text-[#d4a574]">
                                    ${calcularTotal().toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-6 py-3 border-2 border-border rounded-lg hover:bg-accent transition-all hover:scale-105 font-semibold text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || carrito.length === 0}
                            className="flex-1 bg-gradient-to-r from-[#5e2129] to-[#8b7355] text-white px-6 py-3 rounded-lg hover:from-[#7d2b35] hover:to-[#9d8565] transition-all hover:scale-105 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Procesando...
                                </span>
                            ) : (
                                "Finalizar venta"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
