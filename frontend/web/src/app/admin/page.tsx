"use client"

import { useEffect, useState } from "react"
import { Users, TrendingUp, Package, UserPlus, FileText, Settings, Wine, Activity, ShoppingCart, BarChart3 } from "lucide-react"
import Link from "next/link"
import { getUsers } from "@/services/UsersService"
import { getInventario } from "@/services/InventoryService"
import { getVentasMesActual } from "@/services/ReportesService"
import { fetchData } from "@/lib/fetchData"
import type { VentasMesActualReport } from "@/services/ReportesService"

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalUsers, setTotalUsers] = useState(0)
  const [inventario, setInventario] = useState<any[]>([])
  const [ventasMes, setVentasMes] = useState<VentasMesActualReport | null>(null)

  useEffect(() => {
    fetchData(getUsers, (data: any[]) => setTotalUsers(data.length), "usuarios");
    fetchData(getInventario, (data: any[]) => setInventario(data), "inventario");
    
    // Cargar datos de ventas del mes actual
    const loadVentasMes = async () => {
      const result = await getVentasMesActual();
      if (result.success && result.data) {
        setVentasMes(result.data);
      }
    };
    loadVentasMes();
    
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-muted/40 p-4 md:p-6">
      <div className="mb-6 md:mb-8 bg-gradient-to-r from-primary via-primary/90 to-accent p-6 md:p-8 rounded-2xl shadow-2xl border border-primary/30 animate-fade-in">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="bg-white/20 p-2 md:p-3 rounded-xl backdrop-blur-sm shadow-lg">
            <Users className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-md">Panel de Administración</h1>
            <p className="text-sm md:text-base text-white/95 mt-1 font-medium">
              Gestiona tu bodega de manera integral
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-card p-5 md:p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-2 border-primary/20 hover:border-primary/40 group animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wide">
                Total Usuarios
              </h3>
              <p className="text-3xl md:text-4xl font-bold text-primary mt-2 drop-shadow-sm">{totalUsers}</p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1 font-medium">Activos en el sistema</p>
            </div>
            <div className="p-3 md:p-4 rounded-xl bg-primary/15 group-hover:bg-primary/25 transition-all duration-300 border-2 border-primary/30 shadow-lg">
              <Users className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            </div>
          </div>
        </div>

        <div
          className="bg-card p-5 md:p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-2 border-accent/20 hover:border-accent/40 group animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wide">
                Ventas del Mes
              </h3>
              <p className="text-3xl md:text-4xl font-bold text-accent mt-2 drop-shadow-sm">
                ${ventasMes?.mes_actual.total_ventas ? Number(ventasMes.mes_actual.total_ventas).toFixed(2) : "0.00"}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1 font-medium">
                {ventasMes?.cambio_porcentaje && ventasMes.cambio_porcentaje >= 0 ? "+" : ""}
                {ventasMes?.cambio_porcentaje?.toFixed(2)}% vs mes anterior
              </p>
            </div>
            <div className="p-3 md:p-4 rounded-xl bg-accent/15 group-hover:bg-accent/25 transition-all duration-300 border-2 border-accent/30 shadow-lg">
              <TrendingUp className="w-8 h-8 md:w-10 md:h-10 text-accent" />
            </div>
          </div>
        </div>

        <div
          className="bg-card p-5 md:p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-2 border-secondary/20 hover:border-secondary/40 group animate-fade-in sm:col-span-2 lg:col-span-1"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wide">
                Inventario
              </h3>
              <p className="text-3xl md:text-4xl font-bold text-secondary mt-2 drop-shadow-sm">
                {inventario.reduce((acc, inv) => acc + inv.Lote.cantidad_botellas, 0)}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1 font-medium">Botellas en stock</p>
            </div>
            <div className="p-3 md:p-4 rounded-xl bg-secondary/15 group-hover:bg-secondary/25 transition-all duration-300 border-2 border-secondary/30 shadow-lg">
              <Wine className="w-8 h-8 md:w-10 md:h-10 text-secondary" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
        <div className="bg-card p-5 md:p-6 rounded-2xl shadow-xl border-2 border-border hover:shadow-2xl transition-all duration-300 animate-slide-in">
          <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-foreground flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/15 border-2 border-primary/30">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            Gestión de Usuarios
          </h3>
          <div className="space-y-3">
            <Link
              href="/admin/users"
              className="block w-full bg-gradient-to-r from-primary to-primary/90 text-white px-5 md:px-6 py-3 md:py-4 rounded-xl hover:shadow-xl transition-all duration-300 font-semibold text-sm md:text-base flex items-center gap-3 group border border-primary/30"
            >
              <Users className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
              Ver todos los usuarios
            </Link>
            <Link
              href="/admin/users/new"
              className="block w-full bg-muted hover:bg-muted/80 text-foreground px-5 md:px-6 py-3 md:py-4 rounded-xl transition-all duration-300 font-semibold text-sm md:text-base flex items-center gap-3 group border-2 border-border hover:border-primary/30"
            >
              <UserPlus className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform text-primary" />
              Crear nuevo usuario
            </Link>
            <button className="w-full bg-muted hover:bg-muted/80 text-foreground px-5 md:px-6 py-3 md:py-4 rounded-xl transition-all duration-300 font-semibold text-sm md:text-base flex items-center gap-3 group border-2 border-border hover:border-accent/30">
              <FileText className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform text-accent" />
              Reportes de usuarios
            </button>
          </div>
        </div>

        <div
          className="bg-card p-5 md:p-6 rounded-2xl shadow-xl border-2 border-border hover:shadow-2xl transition-all duration-300 animate-slide-in"
          style={{ animationDelay: "0.1s" }}
        >
          <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-foreground flex items-center gap-2">
            <div className="p-2 rounded-lg bg-accent/15 border-2 border-accent/30">
              <Settings className="w-5 h-5 md:w-6 md:h-6 text-accent" />
            </div>
            Configuración del Sistema
          </h3>
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-accent to-accent/90 text-white px-5 md:px-6 py-3 md:py-4 rounded-xl hover:shadow-xl transition-all duration-300 font-semibold text-sm md:text-base flex items-center gap-3 group border border-accent/30">
              <Settings className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-90 transition-transform duration-500" />
              Configuración general
            </button>
            <Link
              href="/admin/inventory"
              className="block w-full bg-muted hover:bg-muted/80 text-foreground px-5 md:px-6 py-3 md:py-4 rounded-xl transition-all duration-300 font-semibold text-sm md:text-base flex items-center gap-3 group border-2 border-border hover:border-primary/30"
            >
              <Package className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform text-primary" />
              Gestión de Inventario
            </Link>
            <Link
              href="/admin/vinos"
              className="block w-full bg-muted hover:bg-muted/80 text-foreground px-5 md:px-6 py-3 md:py-4 rounded-xl transition-all duration-300 font-semibold text-sm md:text-base flex items-center gap-3 group border-2 border-border hover:border-primary/30"
            >
              <Wine className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform text-primary" />
              Catálogo de Vinos
            </Link>
            <Link
              href="/admin/ventas"
              className="block w-full bg-muted hover:bg-muted/80 text-foreground px-5 md:px-6 py-3 md:py-4 rounded-xl transition-all duration-300 font-semibold text-sm md:text-base flex items-center gap-3 group border-2 border-border hover:border-primary/30"
            >
              <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform text-primary" />
              Ventas
            </Link>
            <Link
              href="/admin/ventas/reportes"
              className="block w-full bg-muted hover:bg-muted/80 text-foreground px-5 md:px-6 py-3 md:py-4 rounded-xl transition-all duration-300 font-semibold text-sm md:text-base flex items-center gap-3 group border-2 border-border hover:border-primary/30"
            >
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform text-primary" />
              Reportes de ventas
            </Link>
            <Link
              href="/admin/traceability"
              className="block w-full bg-muted hover:bg-muted/80 text-foreground px-5 md:px-6 py-3 md:py-4 rounded-xl transition-all duration-300 font-semibold text-sm md:text-base flex items-center gap-3 group border-2 border-border hover:border-primary/30"
            >
              <Activity className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform text-primary" />
              Trazabilidad
            </Link>
          </div>
        </div>
      </div>

      <div
        className="bg-card p-5 md:p-6 rounded-2xl shadow-xl border-2 border-border animate-fade-in"
        style={{ animationDelay: "0.3s" }}
      >
        <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-foreground flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/15 border-2 border-primary/30">
            <Activity className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          </div>
          Actividad Reciente
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-muted/60 hover:bg-muted/90 rounded-xl border-2 border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/50"></div>
              <span className="font-semibold text-sm md:text-base text-foreground">Nuevo vino agregado al catálogo</span>
            </div>
            <span className="text-xs md:text-sm text-muted-foreground font-medium">Hace 2h</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-muted/60 hover:bg-muted/90 rounded-xl border-2 border-border hover:border-accent/30 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-accent rounded-full shadow-lg shadow-accent/50"></div>
              <span className="font-semibold text-sm md:text-base text-foreground">Usuario registrado en el sistema</span>
            </div>
            <span className="text-xs md:text-sm text-muted-foreground font-medium">Hace 5h</span>
          </div>
        </div>
      </div>
    </div>
  )
}