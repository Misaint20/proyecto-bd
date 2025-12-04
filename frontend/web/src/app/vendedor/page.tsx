"use client"

import { useEffect, useState } from "react"
import { ShoppingCart, Wine, DollarSign, Users, Award, TrendingUp } from "lucide-react"
import { fetchData } from "@/lib/fetchData"
import { getVentas } from "@/services/VentasService"
import { getVentasMesActual } from "@/services/ReportesService"
import { getInventario } from "@/services/InventoryService"
import Link from "next/link"

export default function VendedorDashboard() {
  const [ventas, setVentas] = useState<any[]>([])
  const [ventasMes, setVentasMes] = useState<any | null>(null)
  const [topProducts, setTopProducts] = useState<Array<{ nombre: string; numero_lote?: string; cantidad: number }>>([])
  const [lotesMap, setLotesMap] = useState<Map<string, string>>(new Map())

  useEffect(() => {
    fetchData(getVentas, (data: any[]) => setVentas(data), "ventas-vendedor")

    const loadMes = async () => {
      const res = await getVentasMesActual()
      if (res.success && res.data) setVentasMes(res.data)
    }
    loadMes()
  }, [])

  useEffect(() => {
    // load lotes mapping from inventory (id_lote -> numero_lote)
    fetchData(getInventario, (data: any[]) => {
      const m = new Map<string, string>()
      data.forEach((inv: any) => {
        if (inv.Lote && inv.Lote.id_lote) {
          m.set(String(inv.Lote.id_lote), inv.Lote.numero_lote || String(inv.Lote.id_lote))
        }
      })
      setLotesMap(m)
    }, "inventario-lotes-map")
  }, [])

  // compute top products (aggregate by vino + lote)
  useEffect(() => {
    if (!ventas || ventas.length === 0) {
      setTopProducts([])
      return
    }

    const map = new Map<string, { nombre: string; numero_lote?: string; cantidad: number }>()
    ventas.forEach((v: any) => {
      const detalles = v.Detalle_Venta || v.detalles || []
      detalles.forEach((d: any) => {
        const vinoNombre = (d.Vino && d.Vino.nombre) || d.nombreVino || d.nombre || d.vino_nombre || `vino-${d.id_vino}`
        const loteId = d.id_lote || d.id_lote || ''
        const key = `${d.id_vino || 'vino'}::${loteId || 'nolote'}`
        const existing = map.get(key)
        const cantidad = Number(d.cantidad || 0)
        if (existing) {
          existing.cantidad += cantidad
        } else {
          map.set(key, { nombre: vinoNombre, numero_lote: loteId ? (lotesMap.get(String(loteId)) || loteId) : undefined, cantidad })
        }
      })
    })

    const arr = Array.from(map.values())
    arr.sort((a, b) => b.cantidad - a.cantidad)
    setTopProducts(arr.slice(0, 5))
  }, [ventas, lotesMap])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-muted/40 p-4 md:p-6">
      <div className="mb-6 md:mb-8 bg-gradient-to-r from-primary via-primary/90 to-accent p-6 md:p-8 rounded-2xl shadow-2xl border border-primary/30 animate-fade-in">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="bg-white/20 p-2 md:p-3 rounded-xl backdrop-blur-sm shadow-lg">
            <ShoppingCart className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-md">Panel de Vendedor</h1>
            <p className="text-sm md:text-base text-white/95 mt-1 font-medium">Gestiona ventas y clientes eficientemente</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
        <div className="bg-card p-5 md:p-6 rounded-2xl shadow-xl border-2 border-border hover:shadow-2xl transition-all duration-300">
          <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-foreground flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/15 border-2 border-primary/30">
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            Acciones Principales
          </h3>
          <div className="space-y-3">
            <Link
              href="/vendedor/inventory#tables" className="block w-full bg-gradient-to-r from-primary to-primary/90 text-white px-5 md:px-6 py-3 md:py-4 rounded-xl hover:shadow-xl transition-all duration-300 font-semibold text-sm md:text-base flex items-center gap-3 group border border-primary/30">
              <Wine className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
              Botellas disponibles
            </Link>
            <Link
              href="/vendedor/ventas" className="block w-full bg-muted hover:bg-muted/80 text-foreground px-5 md:px-6 py-3 md:py-4 rounded-xl transition-all duration-300 font-semibold text-sm md:text-base flex items-center gap-3 group border-2 border-border hover:border-primary/30">
              <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform text-primary" />
              Registrar venta
            </Link>
            <Link
              href="/vendedor/ventas/reportes"
              className="block w-full bg-muted hover:bg-muted/80 text-foreground px-5 md:px-6 py-3 md:py-4 rounded-xl transition-all duration-300 font-semibold text-sm md:text-base flex items-center gap-3 group border-2 border-border hover:border-primary/30">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform text-primary" />
              Ventas del día/mes
            </Link>
            <Link href="/vendedor/clientes" className="block w-full bg-muted hover:bg-muted/80 text-foreground px-5 md:px-6 py-3 md:py-4 rounded-xl transition-all duration-300 font-semibold text-sm md:text-base flex items-center gap-3 group border-2 border-border hover:border-accent/30">
              <Users className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform text-accent" />
              Clientes
            </Link>
          </div>
        </div>

        <div className="bg-card p-5 md:p-6 rounded-2xl shadow-xl border-2 border-border hover:shadow-2xl transition-all duration-300">
          <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-foreground flex items-center gap-2">
            <div className="p-2 rounded-lg bg-accent/15 border-2 border-accent/30">
              <Award className="w-5 h-5 md:w-6 md:h-6 text-accent" />
            </div>
            Top Productos
          </h3>
          <div className="space-y-4">
            {topProducts && topProducts.length > 0 ? (
              topProducts.slice(0, 3).map((p, i) => (
                <div key={i} className="bg-muted/40 p-4 rounded-lg border-2 border-border hover:border-accent/30 hover:shadow-md transition-all duration-300 group">
                  <div className="flex items-start gap-3">
                    <div className="bg-accent/10 p-2 rounded-lg flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                      <Wine className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-foreground font-semibold text-sm md:text-base truncate">{p.nombre}</p>
                      <p className="text-muted-foreground text-xs md:text-sm mt-1">Lote: <span className="font-medium text-foreground">{p.numero_lote || '—'}</span> • Cantidad: <span className="font-medium text-accent">{p.cantidad} botellas</span></p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-muted/50 p-4 rounded-lg border-2 border-dashed border-border hover:border-primary/30 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/15 p-2 rounded-lg flex-shrink-0">
                    <Wine className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-foreground font-semibold text-sm">Sin ventas aún</p>
                    <p className="text-muted-foreground text-xs">Registra ventas para ver estadísticas</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          {ventasMes && (
            <div className="mt-6 p-4 bg-primary/5 rounded-lg border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <p className="text-foreground text-sm md:text-base"><span className="text-muted-foreground">Ventas Mes: </span><span className="font-bold text-primary">${Number(ventasMes.mes_actual.total_ventas).toFixed(2)}</span></p>
              <p className="text-muted-foreground text-xs md:text-sm mt-2">Cambio vs mes anterior: <span className={`font-semibold ${ventasMes.cambio_porcentaje >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{(ventasMes.cambio_porcentaje >= 0 ? '+' : '') + ventasMes.cambio_porcentaje}%</span></p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}