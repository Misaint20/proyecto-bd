"use client"

import { Users, Search, UserPlus, Edit, Trash2, Shield, User, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useMemo } from "react"
import { getUsers } from "@/services/UsersService" // Importar la función de servicio

// Definición de tipos para la data mapeada
interface UserData {
    id: string;
    name: string;
    username: string;
    role: string; // Clave interna para el color (admin, bodeguero, etc.)
    roleName: string; // Nombre completo del rol (Administrador, Bodeguero, etc.)
    email: string;
    status: "active" | "inactive";
    createdAt: string;
}

// Interfaz para la data recibida del API 
interface ApiUser {
    id_usuario: string;
    id_rol: string;
    nombre: string;
    username: string;
    email: string;
    activo: boolean;
    fecha_creacion: string;
    fecha_actualizacion: string;
    Rol: {
        id_rol: string;
        nombre: string; 
        descripcion: string;
    };
}


// Función para mapear el nombre del rol del API a la clave interna del componente para los colores
const getInternalRoleKey = (apiRoleName: string): string => {
    switch (apiRoleName) {
        case "Administrador":
            return "admin";
        case "Encargado_de_Bodega":
            return "bodeguero";
        case "Enologo":
            return "enologo";
        case "Vendedor":
            return "vendedor";
        default:
            return "default";
    }
}

// Función para mapear los usuarios del API a la estructura del componente
const mapApiUsersToComponent = (apiUsers: ApiUser[]): UserData[] => {
    return apiUsers.map((user) => ({
        id: user.id_usuario,
        name: user.nombre,
        username: user.username,
        email: user.email,
        status: user.activo ? "active" : "inactive",
        // Formatear la fecha para una mejor visualización si es necesario, 
        // aquí solo se toma la parte de la fecha
        createdAt: user.fecha_creacion.split('T')[0],
        roleName: user.Rol.nombre, 
        role: getInternalRoleKey(user.Rol.nombre), 
    }));
};

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [users, setUsers] = useState<UserData[]>([]) 
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)


    // Lógica para cargar los usuarios
    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const result = await getUsers()

                if (result && result.success && Array.isArray(result.data.data)) {
                    const mappedUsers = mapApiUsersToComponent(result.data.data as ApiUser[])
                    setUsers(mappedUsers)
                } else if (result) {
                    setError(result.errorMessage || "Error desconocido al cargar usuarios.")
                    setUsers([]) // Limpiar lista en caso de error
                } else {
                    setError("No se recibió respuesta del servicio de usuarios.")
                    setUsers([])
                }
            } catch (err) {
                setError("No se pudo conectar al servicio de usuarios.")
                setUsers([])
            } finally {
                setIsLoading(false)
            }
        }
        fetchUsers()
    }, [])


    const getRoleColor = (role: string) => {
        const colors = {
            admin: "from-blue-500 to-purple-600",
            bodeguero: "from-amber-500 to-orange-600",
            enologo: "from-purple-500 to-pink-600",
            vendedor: "from-green-500 to-emerald-600",
        }
        return colors[role as keyof typeof colors] || "from-gray-500 to-gray-600"
    }

    // Filtrar usuarios usando useMemo para optimizar
    const filteredUsers = useMemo(() => {
        return users.filter(
            (user) =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()),
        )
    }, [users, searchTerm])

    // Calcular estadísticas usando useMemo
    const stats = useMemo(() => {
        return {
            total: users.length,
            active: users.filter((u) => u.status === "active").length,
            admin: users.filter((u) => u.role === "admin").length,
            other: users.filter((u) => u.role !== "admin").length,
        }
    }, [users])


    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 p-8 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                                <Users className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-white">Gestión de Usuarios</h1>
                                <p className="text-white/90 mt-1">Administra todos los usuarios del sistema</p>
                            </div>
                        </div>
                        <Link
                            href="/admin/users/new"
                            className="bg-white text-blue-600 px-6 py-3 rounded-xl hover:bg-blue-50 transition-all font-medium shadow-md hover:shadow-lg flex items-center gap-2 group"
                        >
                            <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Nuevo Usuario
                        </Link>
                    </div>
                </div>

                {/* Mensaje de Error */}
                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-700 dark:bg-red-900/30 dark:text-red-400 p-4 rounded-lg mb-6" role="alert">
                        {error}
                    </div>
                )}

                {/* Search Bar */}
                <div className="mb-6 bg-card p-4 rounded-xl shadow-lg border border-border">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por nombre, usuario o email..."
                            className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground transition-all"
                        />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl shadow-lg">
                        <div className="text-white/90 text-sm font-medium">Total Usuarios</div>
                        <div className="text-3xl font-bold text-white mt-1">{stats.total}</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl shadow-lg">
                        <div className="text-white/90 text-sm font-medium">Activos</div>
                        <div className="text-3xl font-bold text-white mt-1">
                            {stats.active}
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-4 rounded-xl shadow-lg">
                        <div className="text-white/90 text-sm font-medium">Administradores</div>
                        <div className="text-3xl font-bold text-white mt-1">{stats.admin}</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl shadow-lg">
                        <div className="text-white/90 text-sm font-medium">Otros Roles</div>
                        <div className="text-3xl font-bold text-white mt-1">{stats.other}</div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
                    {isLoading ? (
                        <div className="text-center py-12 flex flex-col items-center justify-center">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
                            <p className="text-muted-foreground">Cargando usuarios...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Usuario</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Rol</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Estado</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Fecha Creación</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${getRoleColor(user.role)} flex items-center justify-center`}
                                                    >
                                                        <User className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-foreground">{user.name}</div>
                                                        <div className="text-sm text-muted-foreground">@{user.username}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getRoleColor(user.role)} text-white`}
                                                >
                                                    <Shield className="w-3 h-3" />
                                                    {user.roleName}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${user.status === "active"
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                                        }`}
                                                >
                                                    {user.status === "active" ? "Activo" : "Inactivo"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">{user.createdAt}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {filteredUsers.length === 0 && !isLoading && (
                        <div className="text-center py-12">
                            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                            <p className="text-muted-foreground">
                                {users.length === 0 ? "No se encontraron usuarios en el sistema." : "No se encontraron usuarios que coincidan con la búsqueda."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}