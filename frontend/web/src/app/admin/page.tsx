"use client"

import { useEffect, useState } from "react"
import { Users, TrendingUp, Package, UserPlus, FileText, Settings, Wine, Activity, BarChart3 } from "lucide-react"
import Link from "next/link"
import { getUsers } from "@/services/UsersService"
import { getInventario } from "@/services/InventoryService"

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalUsers, setTotalUsers] = useState(0)
  const [inventario, setInventario] = useState<any[]>([])

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
    fetchData(getUsers, (data: any[]) => setTotalUsers(data.length), "usuarios");
    fetchData(getInventario, (data: any[]) => setInventario(data), "inventario");
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6">
      <div className="mb-6 md:mb-8 bg-gradient-to-r from-primary via-primary to-[oklch(0.4_0.14_20)] p-6 md:p-8 rounded-2xl shadow-xl border border-primary/20 animate-fade-in">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="bg-primary-foreground/15 p-2 md:p-3 rounded-xl backdrop-blur-sm">
            <Users className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-primary-foreground">Panel de Administración</h1>
            <p className="text-sm md:text-base text-primary-foreground/90 mt-1">
              Gestiona tu bodega de manera integral
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-card p-5 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-border group animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Total Usuarios
              </h3>
              <p className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-primary to-[oklch(0.4_0.14_20)] bg-clip-text text-transparent mt-2">
                {totalUsers}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">Activos en el sistema</p>
            </div>
            <div className="p-3 md:p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
              <Users className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            </div>
          </div>
        </div>

        <div
          className="bg-card p-5 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-border group animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Ventas del Mes
              </h3>
              <p className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-accent to-[oklch(0.78_0.13_80)] bg-clip-text text-transparent mt-2">
                $45,230
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">+12% vs mes anterior</p>
            </div>
            <div className="p-3 md:p-4 rounded-xl bg-accent/15 group-hover:bg-accent/25 transition-all duration-300">
              <TrendingUp className="w-8 h-8 md:w-10 md:h-10 text-accent-foreground" />
            </div>
          </div>
        </div>

        <div
          className="bg-card p-5 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-border group animate-fade-in sm:col-span-2 lg:col-span-1"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Inventario
              </h3>
              <p className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-secondary to-[oklch(0.8_0.1_80)] bg-clip-text text-transparent mt-2">
                {inventario.reduce((acc, inv) => acc + inv.Lote.cantidad_botellas, 0)}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">Botellas en stock</p>
            </div>
            <div className="p-3 md:p-4 rounded-xl bg-secondary/20 group-hover:bg-secondary/30 transition-all duration-300">
              <Wine className="w-8 h-8 md:w-10 md:h-10 text-secondary-foreground" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
        <div className="bg-card p-5 md:p-6 rounded-2xl shadow-lg border border-border hover:shadow-xl transition-all duration-300 animate-slide-in">
          <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-card-foreground flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            Gestión de Usuarios
          </h3>
          <div className="space-y-3">
            <Link
              href="/admin/users"
              className="block w-full bg-gradient-to-r from-primary to-[oklch(0.38_0.13_18)] text-primary-foreground px-5 md:px-6 py-3 md:py-4 rounded-xl hover:shadow-lg transition-all duration-300 font-medium text-sm md:text-base flex items-center gap-3 group"
            >
              <Users className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
              Ver todos los usuarios
            </Link>
            <Link
              href="/admin/users/new"
              className="block w-full bg-muted hover:bg-muted/80 text-foreground px-5 md:px-6 py-3 md:py-4 rounded-xl transition-all duration-300 font-medium text-sm md:text-base flex items-center gap-3 group border border-border"
            >
              <UserPlus className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform text-primary" />
              Crear nuevo usuario
            </Link>
            <button className="w-full bg-muted hover:bg-muted/80 text-foreground px-5 md:px-6 py-3 md:py-4 rounded-xl transition-all duration-300 font-medium text-sm md:text-base flex items-center gap-3 group border border-border">
              <FileText className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform text-accent-foreground" />
              Reportes de usuarios
            </button>
          </div>
        </div>

        <div
          className="bg-card p-5 md:p-6 rounded-2xl shadow-lg border border-border hover:shadow-xl transition-all duration-300 animate-slide-in"
          style={{ animationDelay: "0.1s" }}
        >
          <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-card-foreground flex items-center gap-2">
            <div className="p-2 rounded-lg bg-accent/15">
              <Settings className="w-5 h-5 md:w-6 md:h-6 text-accent-foreground" />
            </div>
            Configuración del Sistema
          </h3>
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-accent to-[oklch(0.75_0.12_82)] text-accent-foreground px-5 md:px-6 py-3 md:py-4 rounded-xl hover:shadow-lg transition-all duration-300 font-medium text-sm md:text-base flex items-center gap-3 group">
              <Settings className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-90 transition-transform duration-500" />
              Configuración general
            </button>
            <Link
              href="/admin/inventory"
              className="block w-full bg-muted hover:bg-muted/80 text-foreground px-5 md:px-6 py-3 md:py-4 rounded-xl transition-all duration-300 font-medium text-sm md:text-base flex items-center gap-3 group border border-border"
            >
              <Package className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform text-primary" />
              Gestión de Inventario
            </Link>
            <Link
              href="/admin/vinos"
              className="block w-full bg-muted hover:bg-muted/80 text-foreground px-5 md:px-6 py-3 md:py-4 rounded-xl transition-all duration-300 font-medium text-sm md:text-base flex items-center gap-3 group border border-border"
            >
              <Wine className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform text-primary" />
              Catálogo de Vinos
            </Link>
            <Link
            href="/admin/ventas"
            className="block w-full bg-muted hover:bg-muted/80 text-foreground px-5 md:px-6 py-3 md:py-4 rounded-xl transition-all duration-300 font-medium text-sm md:text-base flex items-center gap-3 group border border-border"
            >
              <BarChart3 className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform text-primary" />
            Ventas
          </Link>
          <Link
            href="/admin/traceability"
            className="block w-full bg-muted hover:bg-muted/80 text-foreground px-5 md:px-6 py-3 md:py-4 rounded-xl transition-all duration-300 font-medium text-sm md:text-base flex items-center gap-3 group border border-border"
            >
              <Activity className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform text-primary" />
            Trazabilidad
          </Link>
          </div>
        </div>
      </div>

      <div
        className="bg-card p-5 md:p-6 rounded-2xl shadow-lg border border-border animate-fade-in"
        style={{ animationDelay: "0.3s" }}
      >
        <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-card-foreground flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Activity className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          </div>
          Actividad Reciente
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-muted/50 hover:bg-muted rounded-xl border border-border hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="font-medium text-sm md:text-base text-foreground">Nuevo vino agregado al catálogo</span>
            </div>
            <span className="text-xs md:text-sm text-muted-foreground">Hace 2h</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-muted/50 hover:bg-muted rounded-xl border border-border hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-accent-foreground rounded-full"></div>
              <span className="font-medium text-sm md:text-base text-foreground">Usuario registrado en el sistema</span>
            </div>
            <span className="text-xs md:text-sm text-muted-foreground">Hace 5h</span>
          </div>
        </div>
      </div>
    </div>
  )
}