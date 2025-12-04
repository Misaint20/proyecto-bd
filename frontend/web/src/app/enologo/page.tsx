"use client"

import { useEffect, useState } from "react"
import { Grape, Wine, Package, AlertTriangle, Search, PackagePlus, PackageMinus, ClipboardCheck, Beaker, Settings, Activity } from "lucide-react"
import Link from "next/link"
import { fetchData } from "@/lib/fetchData"
import { getInventario } from "@/services/InventoryService"
import { getLotes, getControlCalidad, getCosechas, getProcesosProduccion } from "@/services/TraceabilityService"

export default function EnologoDashboard() {
  const [totalBotellas, setTotalBotellas] = useState<number>(0)
  const [totalLotes, setTotalLotes] = useState<number>(0)
  const [totalCosechas, setTotalCosechas] = useState<number>(0)
  const [procesosActivos, setProcesosActivos] = useState<number>(0)
  const [alertasCalidad, setAlertasCalidad] = useState<number>(0)

  useEffect(() => {
    fetchData(getInventario, (data: any[]) => {
      const total = data.reduce((acc: number, item: any) => acc + Number(item.Lote?.cantidad_botellas || 0), 0)
      setTotalBotellas(total)
    }, "inventario-enologo")

    fetchData(getLotes, (data: any[]) => {
      setTotalLotes(data.length)
    }, "lotes-enologo")

    fetchData(getCosechas, (data: any[]) => {
      setTotalCosechas(data.length)
    }, "cosechas-enologo")

    fetchData(getProcesosProduccion, (data: any[]) => {
      setProcesosActivos(data.filter((p: any) => !p.fecha_fin).length)
    }, "procesos-enologo")

    fetchData(getControlCalidad, (data: any[]) => {
      setAlertasCalidad(data.length)
    }, "calidad-enologo")
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-muted/40 p-4 md:p-6">
      <div className="mb-6 md:mb-8 bg-gradient-to-r from-primary via-primary/90 to-accent p-6 md:p-8 rounded-2xl shadow-2xl border border-primary/30 animate-fade-in">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="bg-white/20 p-2 md:p-3 rounded-xl backdrop-blur-sm shadow-lg">
            <Grape className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-md">Panel de Enólogo</h1>
            <p className="text-sm md:text-base text-white/95 mt-1 font-medium">Supervisa la producción y calidad del vino</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-card p-5 md:p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-2 border-primary/20 group animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wide">Botellas en Stock</p>
              <p className="text-2xl md:text-4xl font-bold text-primary mt-2 drop-shadow-sm">{totalBotellas.toLocaleString()}</p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1 font-medium">Listas para distribución</p>
            </div>
            <div className="p-3 md:p-4 rounded-xl bg-primary/15 transition-all duration-300 border-2 border-primary/30 shadow-lg">
              <Wine className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-card p-5 md:p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-2 border-accent/20 group animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wide">Total Lotes</p>
              <p className="text-2xl md:text-4xl font-bold text-accent mt-2 drop-shadow-sm">{totalLotes}</p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1 font-medium">Registros de lotes</p>
            </div>
            <div className="p-3 md:p-4 rounded-xl bg-accent/15 transition-all duration-300 border-2 border-accent/30 shadow-lg">
              <Package className="w-8 h-8 md:w-10 md:h-10 text-accent" />
            </div>
          </div>
        </div>

        <div className="bg-card p-5 md:p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-2 border-secondary/20 group animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wide">Procesos Activos</p>
              <p className="text-2xl md:text-4xl font-bold text-secondary mt-2 drop-shadow-sm">{procesosActivos}</p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1 font-medium">En producción</p>
            </div>
            <div className="p-3 md:p-4 rounded-xl bg-secondary/15 transition-all duration-300 border-2 border-secondary/30 shadow-lg">
              <Settings className="w-8 h-8 md:w-10 md:h-10 text-secondary" />
            </div>
          </div>
        </div>

        <div className="bg-card p-5 md:p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-2 border-destructive/20 group animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wide">Controles Realizados</p>
              <p className="text-2xl md:text-4xl font-bold text-destructive mt-2 drop-shadow-sm">{alertasCalidad}</p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1 font-medium">Controles registrados</p>
            </div>
            <div className="p-3 md:p-4 rounded-xl bg-destructive/10 transition-all duration-300 border-2 border-destructive/30 shadow-lg">
              <AlertTriangle className="w-8 h-8 md:w-10 md:h-10 text-destructive" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
        <div className="bg-card p-5 md:p-6 rounded-2xl shadow-xl border-2 border-border hover:shadow-2xl transition-all duration-300 animate-slide-in">
          <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-foreground flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/15 border-2 border-primary/30">
              <Activity className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            Trazabilidad
          </h3>
          <div className="space-y-3">
            <Link href="/enologo/quality#lotes" className="block w-full bg-gradient-to-r from-primary to-primary/90 text-white px-5 md:px-6 py-3 md:py-4 rounded-xl hover:shadow-xl transition-all duration-300 font-semibold text-sm md:text-base flex items-center gap-3 group border border-primary/30">
              <Package className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform text-primary" />
              Ver trazabilidad completa
            </Link>
            <Link href="/enologo/quality#create" className="block w-full bg-muted hover:bg-muted/80 text-foreground px-5 md:px-6 py-3 md:py-4 rounded-xl transition-all duration-300 font-semibold text-sm md:text-base flex items-center gap-3 group border-2 border-border hover:border-primary/30">
              <Search className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform text-accent" />
              Crear / Registrar entradas
            </Link>
          </div>
        </div>

        <div className="bg-card p-5 md:p-6 rounded-2xl shadow-xl border-2 border-border hover:shadow-2xl transition-all duration-300 animate-slide-in">
          <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-foreground flex items-center gap-2">
            <div className="p-2 rounded-lg bg-accent/15 border-2 border-accent/30">
              <Beaker className="w-5 h-5 md:w-6 md:h-6 text-accent" />
            </div>
            Control de Calidad
          </h3>
          <div className="space-y-3">
            <Link href="/enologo/quality#controles" className="block w-full bg-gradient-to-r from-accent to-accent/90 text-white px-5 md:px-6 py-3 md:py-4 rounded-xl hover:shadow-xl transition-all duration-300 font-semibold text-sm md:text-base flex items-center gap-3 group border border-accent/30">
              <ClipboardCheck className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform text-accent" />
              Inspecciones y controles
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
