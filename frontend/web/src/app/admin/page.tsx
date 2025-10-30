import { Users, TrendingUp, Package, UserPlus, FileText, Settings, BarChart3, Activity } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 p-8 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Panel de Administración</h1>
            <p className="text-white/90 mt-1">Gestiona tu sistema de manera eficiente</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white/90">Total Usuarios</h3>
              <p className="text-4xl font-bold text-white mt-2">5</p>
              <p className="text-white/80 text-sm mt-1">Activos en el sistema</p>
            </div>
            <Users className="w-12 h-12 text-white/30 group-hover:text-white/50 transition-colors" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white/90">Ventas del Mes</h3>
              <p className="text-4xl font-bold text-white mt-2">$45,230</p>
              <p className="text-white/80 text-sm mt-1">+12% vs mes anterior</p>
            </div>
            <TrendingUp className="w-12 h-12 text-white/30 group-hover:text-white/50 transition-colors" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white/90">Inventario</h3>
              <p className="text-4xl font-bold text-white mt-2">2,845</p>
              <p className="text-white/80 text-sm mt-1">Productos en stock</p>
            </div>
            <Package className="w-12 h-12 text-white/30 group-hover:text-white/50 transition-colors" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-xl shadow-lg border border-border hover:shadow-xl transition-shadow">
          <h3 className="text-2xl font-bold mb-6 text-card-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" />
            Gestión de Usuarios
          </h3>
          <div className="space-y-3">
            <Link
              href="/admin/users"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium text-left flex items-center gap-3 group shadow-md hover:shadow-lg">
              <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Ver todos los usuarios
            </Link>
            <Link
              href="/admin/users/new"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-medium text-left flex items-center gap-3 group shadow-md hover:shadow-lg">
              <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Crear nuevo usuario
            </Link>
            <button className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-4 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all font-medium text-left flex items-center gap-3 group shadow-md hover:shadow-lg">
              <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Reportes de usuarios
            </button>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-lg border border-border hover:shadow-xl transition-shadow">
          <h3 className="text-2xl font-bold mb-6 text-card-foreground flex items-center gap-2">
            <Settings className="w-6 h-6 text-purple-500" />
            Configuración del Sistema
          </h3>
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all font-medium text-left flex items-center gap-3 group shadow-md hover:shadow-lg">
              <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              Configuración general
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-card p-6 border border-border rounded-xl shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-card-foreground flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-amber-500" />
          Acceso Rápido
        </h3>
        <div className="flex gap-3 flex-wrap">
          <Link 
            href="/admin/ventas"
          className="bg-gradient-to-r from-amber-400 to-amber-500 dark:from-amber-600 dark:to-amber-700 text-white px-6 py-3 rounded-lg hover:from-amber-500 hover:to-amber-600 dark:hover:from-amber-700 dark:hover:to-amber-800 transition-all font-medium shadow-md hover:shadow-lg hover:scale-105">
            Ventas
          </Link>
          <Link 
            href="/admin/vinos"
            className="bg-gradient-to-r from-amber-400 to-amber-500 dark:from-amber-600 dark:to-amber-700 text-white px-6 py-3 rounded-lg hover:from-amber-500 hover:to-amber-600 dark:hover:from-amber-700 dark:hover:to-amber-800 transition-all font-medium shadow-md hover:shadow-lg hover:scale-105">
            Vinos
          </Link>
        </div>
      </div>

      <div className="mt-6 bg-card p-6 rounded-xl shadow-lg border border-border">
        <h3 className="text-2xl font-bold mb-6 text-card-foreground flex items-center gap-2">
          <Activity className="w-6 h-6 text-blue-500" />
          Actividad Reciente
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg border border-blue-200 dark:border-blue-700 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-blue-700 dark:text-blue-300">Nuevo vino agregado</span>
            </div>
            <span className="text-sm text-muted-foreground">Hace 1 día</span>
          </div>
        </div>
      </div>
    </div>
  )
}
