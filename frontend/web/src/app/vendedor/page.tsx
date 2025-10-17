export default function VendedorDashboard(){
    return (
        <div className="min-h-screen bg-white p-6">
            <div className="mb-8">
               <h1 className="text-3xl font-bold text-gray-800">Vendedor</h1> 
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">General</h3>
          <div className="space-y-3">
            <button className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium text-left">
               Botellas disponibles
            </button>
            <button className="w-full bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium text-left">
               ✔ Registrar venta
            </button>
            <button className="w-full bg-orange-400 text-white px-4 py-3 rounded-lg hover:bg-orange-500 font-medium text-left"> 💰Ventas del día/mes</button>
            <button className="w-full bg-fuchsia-400 text-white px-4 py-3 rounded-lg hover:bg-fuchsia-600 font-medium text-left ">Clientes</button>
          </div>
          
        </div><br />
        <div className="mt-5 bg-amber-100 p-6 rounded-lg shadow">
        <h3 className="text-3xl font-semibold  mb-4 text-gray-800">Productos mas vendidos</h3>
        <div className="space-y-3">
          <div className="flex items-center w-full bg-amber-100 rounded text-blue-700">
            <ul className="text-2xl font-semibold">
                <li>Chardonnay 2022 🍷</li>
                <li>Protesta espumoso 🍾</li>
                <li>Drosophila tinto merlot 🍷</li>
            </ul>
          </div>
        </div>
      </div>
        
      </div>
        </div>
    );
}