"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createUser } from "@/services/UsersService"
import { UserPlus, User, Lock, Eye, EyeOff, Shield, ArrowLeft, Mail } from "lucide-react"
import { Label } from "@/components/ui/label"
import { showAlert } from "@/lib/alert"
import Link from "next/link"

export default function NewUserPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [selectedRole, setSelectedRole] = useState("")
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    })

    const roles = [
        {
            id: "Administrador",
            name: "Administrador",
            description: "Acceso completo al sistema",
            gradient: "from-blue-500 to-purple-600",
            icon: Shield,
        },
        {
            id: "Encargado_de_Bodega",
            name: "Encargado de Bodega",
            description: "Gestión de inventario y almacén",
            gradient: "from-amber-500 to-orange-600",
            icon: User,
        },
        {
            id: "Enologo_Productor",
            name: "Enologo Productor",
            description: "Control de calidad y producción",
            gradient: "from-purple-500 to-pink-600",
            icon: User,
        },
        {
            id: "Vendedor",
            name: "Vendedor",
            description: "Gestión de ventas y clientes",
            gradient: "from-green-500 to-emerald-600",
            icon: User,
        },
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const result = await createUser({ ...formData, role: selectedRole })
            if (result?.success) {
                await showAlert({ description: "Usuario creado exitosamente" })
                router.push("/admin/users")
            } else {
                await showAlert({ description: "Error al crear el usuario: " + (result?.errorMessage ?? "") })
            }
        } catch (error: any) {
            await showAlert({ description: "Error al crear el usuario: " + (error?.message ?? "") })
        }
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 p-8 rounded-2xl shadow-lg">
                    <Link
                        href="/admin/users"
                        className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Volver a usuarios
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white">Crear Nuevo Usuario</h1>
                            <p className="text-white/90 mt-1">Completa el formulario para agregar un usuario al sistema</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Información Personal */}
                    <div className="bg-card p-6 rounded-xl shadow-lg border border-border">
                        <h2 className="text-2xl font-bold mb-6 text-card-foreground flex items-center gap-2">
                            <User className="w-6 h-6 text-green-500" />
                            Información Personal
                        </h2>

                        <div className="space-y-4">
                            {/* Nombre */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                                    Nombre Completo
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-foreground transition-all"
                                        placeholder="Ej: Juan Pérez"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                    Correo Electrónico
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Ej: juan.perez@bodega.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-foreground transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Nombre de Usuario */}
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
                                    Nombre de Usuario
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="text"
                                        id="username"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-foreground transition-all"
                                        placeholder="Ej: jperez"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Seguridad */}
                    <div className="bg-card p-6 rounded-xl shadow-lg border border-border">
                        <h2 className="text-2xl font-bold mb-6 text-card-foreground flex items-center gap-2">
                            <Lock className="w-6 h-6 text-green-500" />
                            Seguridad
                        </h2>

                        <div className="space-y-4">
                            {/* Contraseña */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-10 pr-12 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-foreground transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirmar Contraseña */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                                    Confirmar Contraseña
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="w-full pl-10 pr-12 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-foreground transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Selección de Rol */}
                    <div className="bg-card p-6 rounded-xl shadow-lg border border-border">
                        <h2 className="text-2xl font-bold mb-6 text-card-foreground flex items-center gap-2">
                            <Shield className="w-6 h-6 text-green-500" />
                            Rol del Usuario
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {roles.map((role) => {
                                const Icon = role.icon
                                return (
                                    <button
                                        key={role.id}
                                        type="button"
                                        onClick={() => setSelectedRole(role.id)}
                                        className={`p-6 rounded-xl border-2 transition-all text-left ${selectedRole === role.id
                                            ? `bg-gradient-to-br ${role.gradient} border-transparent shadow-lg scale-105`
                                            : "bg-card border-border hover:border-green-500 hover:shadow-md"
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`p-2 rounded-lg ${selectedRole === role.id ? "bg-white/20" : "bg-gradient-to-br " + role.gradient
                                                    }`}
                                            >
                                                <Icon className={`w-6 h-6 ${selectedRole === role.id ? "text-white" : "text-white"}`} />
                                            </div>
                                            <div className="flex-1">
                                                <h3
                                                    className={`font-bold text-lg ${selectedRole === role.id ? "text-white" : "text-card-foreground"
                                                        }`}
                                                >
                                                    {role.name}
                                                </h3>
                                                <p
                                                    className={`text-sm mt-1 ${selectedRole === role.id ? "text-white/90" : "text-muted-foreground"
                                                        }`}
                                                >
                                                    {role.description}
                                                </p>
                                            </div>
                                            {selectedRole === role.id && (
                                                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex gap-4">
                        <Link
                            href="/admin"
                            className="flex-1 bg-card border-2 border-border text-foreground px-6 py-4 rounded-xl hover:bg-muted transition-all font-medium text-center shadow-md hover:shadow-lg"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={!selectedRole}
                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <UserPlus className="w-5 h-5" />
                            Crear Usuario
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
