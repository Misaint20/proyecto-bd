"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, User, Lock, LogIn } from "lucide-react"
import { login, getDashboardPath } from "@/services/AuthService"

export default function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (username && password) {
      login(username, password).then(result => {
        if (result.success && result.user?.role) {
          router.push(getDashboardPath(result.user.role))
        } else {
          alert(result.errorMessage)
        }
      })
    } else {
      alert("Por favor completa todos los campos")
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

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-foreground">Usuario</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-input bg-background text-foreground focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all outline-none"
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
            className="w-full pl-10 pr-12 py-3 rounded-lg border-2 border-input bg-background text-foreground focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all outline-none"
            placeholder="••••••••"
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

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white py-3 px-4 rounded-lg transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <LogIn className="w-5 h-5" />
        Iniciar Sesión
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