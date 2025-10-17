import Image from "next/image"
import LoginForm from "@/components/auth/LoginForm"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-950 dark:via-orange-950 dark:to-red-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-red-500 rounded-2xl blur-xl opacity-30"></div>
            <Image
              src="/vino.jpeg"
              alt="Logo"
              width={200}
              height={100}
              className="rounded-2xl shadow-2xl border-4 border-white/50 dark:border-white/10 relative"
              priority
            />
          </div>
        </div>

        <header className="text-center space-y-2">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 dark:from-amber-400 dark:via-orange-400 dark:to-red-400 bg-clip-text text-transparent">
            Bienvenido
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500"></div>
            <p className="text-3xl font-bold text-foreground">Drosophila</p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-red-500"></div>
          </div>
          <p className="text-muted-foreground font-medium">Sistema de Gestión Vitivinícola</p>
        </header>

        <LoginForm />

        <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
          <div className="bg-card p-4 rounded-xl shadow-lg border border-border hover:shadow-xl transition-all hover:scale-105 group">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white text-lg">
                👨‍💼
              </div>
              <h3 className="font-semibold text-amber-800 dark:text-amber-400">Administrador</h3>
            </div>
            <p className="text-muted-foreground text-xs">Gestión completa del sistema</p>
          </div>

          <div className="bg-card p-4 rounded-xl shadow-lg border border-border hover:shadow-xl transition-all hover:scale-105 group">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg">
                📦
              </div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-400">Bodeguero</h3>
            </div>
            <p className="text-muted-foreground text-xs">Control de inventario</p>
          </div>

          <div className="bg-card p-4 rounded-xl shadow-lg border border-border hover:shadow-xl transition-all hover:scale-105 group">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-lg">
                🍇
              </div>
              <h3 className="font-semibold text-purple-800 dark:text-purple-400">Enólogo</h3>
            </div>
            <p className="text-muted-foreground text-xs">Procesos de producción</p>
          </div>

          <div className="bg-card p-4 rounded-xl shadow-lg border border-border hover:shadow-xl transition-all hover:scale-105 group">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-lg">
                💸
              </div>
              <h3 className="font-semibold text-green-800 dark:text-green-400">Vendedor</h3>
            </div>
            <p className="text-muted-foreground text-xs">Ventas y clientes</p>
          </div>
        </div>
      </div>
    </div>
  )
}
