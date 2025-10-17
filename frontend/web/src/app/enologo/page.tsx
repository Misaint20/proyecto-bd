import {
  Grape,
  Wine,
  Package,
  AlertTriangle,
  Search,
  PackagePlus,
  PackageMinus,
  ClipboardCheck,
  Beaker,
} from "lucide-react"

export default function EnologoDashboard() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mb-8 bg-gradient-to-r from-amber-500 to-red-600 dark:from-amber-600 dark:to-red-700 p-8 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
            <Grape className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Panel de Enólogo</h1>
            <p className="text-white/90 mt-1">Supervisa la producción y calidad del vino</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white/90">Botellas en Stock</h3>
              <p className="text-4xl font-bold text-white mt-2">1,245</p>
              <p className="text-white/80 text-sm mt-1">Listas para distribución</p>
            </div>
            <Wine className="w-12 h-12 text-white/30 group-hover:text-white/50 transition-colors" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white/90">Barricas Activas</h3>
              <p className="text-4xl font-bold text-white mt-2">10</p>
              <p className="text-white/80 text-sm mt-1">En proceso de maduración</p>
            </div>
            <Package className="w-12 h-12 text-white/30 group-hover:text-white/50 transition-colors" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white/90">Alertas Stock</h3>
              <p className="text-4xl font-bold text-white mt-2">3</p>
              <p className="text-white/80 text-sm mt-1">Revisión necesaria</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-white/30 group-hover:text-white/50 transition-colors animate-pulse" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-xl shadow-lg border border-border hover:shadow-xl transition-shadow">
          <h3 className="text-2xl font-bold mb-6 text-card-foreground flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-500" />
            Gestión de Inventario
          </h3>
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium text-left flex items-center gap-3 group shadow-md hover:shadow-lg">
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Ver inventario completo
            </button>
            <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-medium text-left flex items-center gap-3 group shadow-md hover:shadow-lg">
              <PackagePlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Registrar entrada de barrica
            </button>
            <button className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-medium text-left flex items-center gap-3 group shadow-md hover:shadow-lg">
              <PackageMinus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Registrar salida de barrica
            </button>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-lg border border-border hover:shadow-xl transition-shadow">
          <h3 className="text-2xl font-bold mb-6 text-card-foreground flex items-center gap-2">
            <Beaker className="w-6 h-6 text-purple-500" />
            Control de Calidad
          </h3>
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all font-medium text-left flex items-center gap-3 group shadow-md hover:shadow-lg">
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Inspeccionar barricas
            </button>
            <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-4 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all font-medium text-left flex items-center gap-3 group shadow-md hover:shadow-lg">
              <ClipboardCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Registrar control
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
