export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Administrador</h1>
        
      </div>
      
     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border-2 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-700">Total Usuarios</h3>
          <p className="text-3xl font-bold text-blue-600">5</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border-2 border-purple-500">
          <h3 className="text-lg font-semibold text-gray-700">Ventas del Mes</h3>
          <p className="text-3xl font-bold text-purple-600">$45,230</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border-2 border-amber-500">
          <h3 className="text-lg font-semibold text-gray-700">Inventario</h3>
          <p className="text-3xl font-bold text-amber-600">2,845</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Gestión de Usuarios</h3>
          <div className="space-y-3">
            <button className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium text-left">
              👤 Ver todos los usuarios
            </button>
            <button className="w-full bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium text-left">
              ➕ Crear nuevo usuario
            </button>
            <button className="w-full bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium text-left">
               📋 Reportes de usuarios
            </button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Configuración del Sistema</h3>
          <div className="space-y-3">
            <button className="w-full bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition-colors font-medium text-left">
              ⚙️ Configuración general
            </button>
          </div>
        </div>
      </div>
      <div className="mt-5 bg-white p-6">
         <button className="w-min  bg-amber-200 text-black px-4 py-3 rounded-lg hover:bg-amber-300 transition-colors font-medium text-left">Ventas</button><br /><br />
         <button className="w-min bg-amber-200 text-black px-4 py-3 rounded-lg hover:bg-amber-300 transition-colors font-medium text-left">Vinos</button>
      </div>
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Actividad Reciente</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded text-blue-700">
            <span>Nuevo vino agregado</span>
            <span className="text-sm text-gray-500">Hace 1 día</span>
          </div>
        </div>
      </div>
    
    </div>
  );
}