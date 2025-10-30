"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, User, Lock, LogIn, AlertCircle } from "lucide-react"

export default function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!username || !password) {
      setError("Por favor completa todos los campos")
      setLoading(false)
      return
    }

    try {
      console.log("Intentando login con:", { username })
      
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })

      console.log("Respuesta del servidor:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("Login exitoso:", data)

        // Guardar el token en localStorage
        if (data.access_token) {
          localStorage.setItem("token", data.access_token)
          
          // Se guarda la informacion del usuario
          if (data.user_info) {
            localStorage.setItem("user", JSON.stringify(data.user_info))
          }

          // Redirigir según el rol del usuario
          const userRole = data.user_info?.role
          
          switch (userRole) {
            case "Administrador":
              router.push("/admin")
              break
            case "Encargado_de_Bodega":
              router.push("/bodeguero")
              break
            case "Enologo":
              router.push("/enologo")
              break
            case "Vendedor":
              router.push("/ventas")
              break
            default:
              router.push("/admin")
          }
        } else {
          setError("Error: No se recibió el token de autenticación")
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error("Error de login:", errorData)
        
        if (response.status === 401) {
          setError("Usuario o contraseña incorrectos")
        } else {
          setError(errorData.message || "Error al iniciar sesión")
        }
      }
    } catch (error) {
      console.error("Error de conexión:", error)
      setError("Error de conexión con el servidor. Verifica que el backend esté corriendo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className="bg-card p-8 text-card-foreground rounded-2xl shadow-2xl space-y-6 border border-border backdrop-blur-sm"
    >
      <div className="text-center space-y-2 pb-4 border-b border-border">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-red-500 mb-2">
          <LogIn className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-red-600 dark:from-amber-400 dark:to-red-400 bg-clip-text text-transparent">
          Iniciar Sesión
        </h2>
        <p className="text-sm text-muted-foreground">Ingresa tus credenciales para continuar</p>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-foreground">Usuario</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-input bg-background text-foreground focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all outline-none disabled:opacity-50"
            placeholder="tu_usuario"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-foreground">Contraseña</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full pl-10 pr-12 py-3 rounded-lg border-2 border-input bg-background text-foreground focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all outline-none disabled:opacity-50"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white py-3 px-4 rounded-lg transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Iniciando sesión...
          </>
        ) : (
          <>
            <LogIn className="w-5 h-5" />
            Iniciar Sesión
          </>
        )}
      </button>

      <div className="text-center pt-2">
        <button
          type="button"
          className="text-sm text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>
    </form>
  )
}