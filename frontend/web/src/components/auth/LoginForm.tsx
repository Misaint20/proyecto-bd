'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    
    if (username && password && role) {
      
      switch(role) {
        case 'admin':
          router.push('/admin');
          break;
        case 'bodeguero':
          router.push('/bodeguero');
          break;
        case 'enologo':
          router.push('/enologo');
          break;
        case 'vendedor':
          router.push('/vendedor');
          break;
        default:
          alert('Rol no válido');
      }
    } else {
      alert('Por favor completa todos los campos');
    }
  };

  return (
    <form onSubmit={handleLogin} className="bg-white p-6 text-black rounded-xl shadow-lg space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Usuario</label>
        <input 
        
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          placeholder="Ingresa tu usuario"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Contraseña</label>
        <input
          
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          placeholder="Ingresa tu contraseña"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Rol</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 "
        >
          <option value="">Selecciona tu rol</option>
          <option className='text-black' value="admin">Administrador</option>
          <option className='text-black' value="bodeguero">Encargado de Bodega</option>
          <option className="text-black" value="enologo">Enologo/Productor</option>
          <option className='text-black' value="vendedor">Vendedor</option>
        </select>
      </div>
      
      <button
        type="submit"
        className="w-full bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 transition-colors font-medium"
      >
        Iniciar Sesión
      </button>
    </form>
  );
}