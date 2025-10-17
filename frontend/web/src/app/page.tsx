import Image from 'next/image';
import LoginForm from '@/components/auth/LoginForm';
import { relative } from 'path';

export default function Home(){
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-center">
          <Image
          src="/vino.jpeg" alt="Logo" width={200} height={100} className="rounded-lg" priority
          />
        </div>
        <header className="text-6xl text-center justify-center font-bold text-black">Bienvenido</header>
        <div className="text-center">
          <h1 className="text-3xl  font-bold text-gray-900">Drosophila</h1>
          <p className="mt-2 text-black">Sistema</p>
        </div>
        <LoginForm/>
        <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-amber-800">Administrador 👨‍💼</h3>
            <p className="text-gray-600 text-xs mt-1">Gestión completa del sistema</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-blue-800">Bodeguero 📦</h3>
            <p className="text-gray-600 text-xs mt-1">Control de inventario</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-purple-800">Enólogo 🍇</h3>
            <p className="text-gray-600 text-xs mt-1">Procesos de producción</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-green-800">Vendedor 💸</h3>
            <p className="text-gray-600 text-xs mt-1">Ventas y clientes</p>
          </div>
      </div>
    </div>
</div>
  );
}