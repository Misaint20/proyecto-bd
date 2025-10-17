export default function EnologoDashboard(){
    return (
        <div className="min-h-screen bg-white p-6">
            <div className="mb-8">
               <h1 className="text-3xl font-bold text-gray-800">Enólogo 🍇</h1> 
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow border-2 border-amber-500">
                    <h3 className="text-lg font-semibold text-gray-700">Botellas en stock</h3>
                    <p className="text-3xl font-bold text-amber-500">1,245</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border-2 border-green-500">
                <h3 className="text-lg font-semibold text-gray-700">Barricas Activas</h3>
                <p className="text-3xl font-bold text-green-600">10</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border-2 border-red-500">
                <h3 className="text-lg font-semibold text-gray-700">⚠️ Alertas Stock</h3>
                <p className="text-3xl font-bold text-red-600">3</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Gestión de Inventario</h3>
          <div className="space-y-3">
            <button className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium text-left">
              ✅📦 Ver inventario completo
            </button>
            <button className="w-full bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium text-left">
               Registrar entrada de barrica
            </button>
            <button className="w-full bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium text-left">
               Registrar salida de barrica
            </button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Control de Calidad</h3>
          <div className="space-y-3">
            <button className="w-full bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition-colors font-medium text-left">
              🕵️ Inspeccionar barricas
            </button>
            <button className="w-full bg-amber-500 text-white px-4 py-3 rounded-lg hover:bg-amber-600 transition-colors font-medium text-left">
              🎛️ Registrar control
            </button>
          </div>
        </div>
        

      </div>
        </div>
    );
}