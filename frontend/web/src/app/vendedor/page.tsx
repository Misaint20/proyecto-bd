import { ShoppingCart, Wine, DollarSign, Users, Award } from "lucide-react"

export default function VendedorDashboard() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mb-8 bg-gradient-to-r from-green-500 to-blue-600 dark:from-green-600 dark:to-blue-700 p-8 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
            <ShoppingCart className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Panel de Vendedor</h1>
            <p className="text-white/90 mt-1">Gestiona ventas y clientes eficientemente</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card p-6 rounded-xl shadow-lg border border-border hover:shadow-xl transition-shadow">
          <h3 className="text-2xl font-bold mb-6 text-card-foreground flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-blue-500" />
            Acciones Principales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium text-left flex items-center gap-3 group shadow-md hover:shadow-lg">
              <Wine className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Botellas disponibles
            </button>
            <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-medium text-left flex items-center gap-3 group shadow-md hover:shadow-lg">
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Registrar venta
            </button>
            <button className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-4 rounded-xl hover:from-orange-500 hover:to-orange-600 transition-all font-medium text-left flex items-center gap-3 group shadow-md hover:shadow-lg">
              <DollarSign className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Ventas del día/mes
            </button>
            <button className="bg-gradient-to-r from-fuchsia-400 to-fuchsia-500 text-white px-6 py-4 rounded-xl hover:from-fuchsia-500 hover:to-fuchsia-600 transition-all font-medium text-left flex items-center gap-3 group shadow-md hover:shadow-lg">
              <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Clientes
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-400 to-amber-600 dark:from-amber-600 dark:to-amber-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-6 h-6 text-white" />
            <h3 className="text-2xl font-bold text-white">Top Productos</h3>
          </div>
          <div className="space-y-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg hover:bg-white/30 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="bg-white/30 p-2 rounded-lg">
                  <Wine className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">Chardonnay 2022</p>
                  <p className="text-white/80 text-sm">Vino blanco premium</p>
                </div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg hover:bg-white/30 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="bg-white/30 p-2 rounded-lg">
                  <Wine className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">Protesta Espumoso</p>
                  <p className="text-white/80 text-sm">Espumante especial</p>
                </div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg hover:bg-white/30 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="bg-white/30 p-2 rounded-lg">
                  <Wine className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">Drosophila Tinto</p>
                  <p className="text-white/80 text-sm">Merlot reserva</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
