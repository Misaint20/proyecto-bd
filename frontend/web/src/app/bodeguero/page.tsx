import Image from "next/image"
import Link from "next/link"
import { Package, Wine, AlertTriangle, ClipboardCheck, PackagePlus, PackageMinus, Search } from "lucide-react"

export default function BodegueroDashboard() {
  return(
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6">
      <div className="mb-6 md:mb-8 bg-gradient-to-r from-primary via-primary to-[oklch(0.4_0.14_20)] p-6 md:p-8 rounded-2xl shadow-xl border border-primary/20 animate-fade-in">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="bg-primary-foreground/15 p-2 md:p-3 rounded-xl backdrop-blur-sm">
            <Package className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-primary-foreground">Panel de Bodeguero</h1>
            <p className="text-sm md:text-base text-primary-foreground/90 mt-1">
              Gestiona el inventario y control de calidad
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-card p-5 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-border group animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Botellas en Stock
              </h3>
              <p className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-primary to-[oklch(0.4_0.14_20)] bg-clip-text text-transparent mt-2">
                1,245
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">Unidades disponibles</p>
            </div>
            <div className="p-3 md:p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
              <Wine className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            </div>
          </div>
        </div>

        <div
          className="bg-card p-5 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-border group animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Barricas Activas
              </h3>
              <p className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-accent to-[oklch(0.78_0.13_80)] bg-clip-text text-transparent mt-2">
                10
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">En proceso de añejamiento</p>
            </div>
            <div className="p-3 md:p-4 rounded-xl bg-accent/15 group-hover:bg-accent/25 transition-all duration-300">
              <Package className="w-8 h-8 md:w-10 md:h-10 text-accent-foreground" />
            </div>
          </div>
        </div>

        <div
          className="bg-card p-5 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-border group animate-fade-in sm:col-span-2 lg:col-span-1"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Alertas Stock
              </h3>
              <p className="text-3xl md:text-4xl font-bold text-destructive mt-2">3</p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">Requieren atención</p>
            </div>
            <div className="p-3 md:p-4 rounded-xl bg-destructive/10 group-hover:bg-destructive/20 transition-all duration-300">
              <AlertTriangle className="w-8 h-8 md:w-10 md:h-10 text-destructive animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-card p-5 md:p-6 rounded-2xl shadow-lg border border-border hover:shadow-xl transition-all duration-300 animate-slide-in">
          <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-card-foreground flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            Gestión de Inventario
          </h3>
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-primary to-[oklch(0.38_0.13_18)] text-primary-foreground px-5 md:px-6 py-3 md:py-4 rounded-xl hover:shadow-lg transition-all duration-300 font-medium text-sm md:text-base flex items-center gap-3 group">
              <Search className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
              Ver inventario completo
            </button>
            <button className="w-full bg-muted hover:bg-muted/80 text-foreground px-5 md:px-6 py-3 md:py-4 rounded-xl transition-all duration-300 font-medium text-sm md:text-base flex items-center gap-3 group border border-border">
              <PackagePlus className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform text-primary" />
              Registrar entrada
            </button>
            <button className="w-full bg-muted hover:bg-muted/80 text-foreground px-5 md:px-6 py-3 md:py-4 rounded-xl transition-all duration-300 font-medium text-sm md:text-base flex items-center gap-3 group border border-border">
              <PackageMinus className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform text-destructive" />
              Registrar salida
            </button>
          </div>
        </div>

        <div
          className="bg-card p-5 md:p-6 rounded-2xl shadow-lg border border-border hover:shadow-xl transition-all duration-300 animate-slide-in"
          style={{ animationDelay: "0.1s" }}
        >
          <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-card-foreground flex items-center gap-2">
            <div className="p-2 rounded-lg bg-accent/15">
              <ClipboardCheck className="w-5 h-5 md:w-6 md:h-6 text-accent-foreground" />
            </div>
            Control de Calidad
          </h3>
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-accent to-[oklch(0.75_0.12_82)] text-accent-foreground px-5 md:px-6 py-3 md:py-4 rounded-xl hover:shadow-lg transition-all duration-300 font-medium text-sm md:text-base flex items-center gap-3 group">
              <Search className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
              Inspeccionar barricas
            </button>
            <button className="w-full bg-muted hover:bg-muted/80 text-foreground px-5 md:px-6 py-3 md:py-4 rounded-xl transition-all duration-300 font-medium text-sm md:text-base flex items-center gap-3 group border border-border">
              <ClipboardCheck className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform text-accent-foreground" />
              Registrar control
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}