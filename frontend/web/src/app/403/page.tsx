"use client"

import { ShieldAlert, Home, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ForbiddenPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Main Card */}
                <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header with gradient */}
                    <div className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 p-8 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-full">
                                <ShieldAlert className="w-20 h-20 text-white" />
                            </div>
                        </div>
                        <h1 className="text-5xl font-bold text-white mb-2">403</h1>
                        <p className="text-xl text-white/90 font-medium">Acceso Denegado</p>
                    </div>

                    {/* Content */}
                    <div className="p-8 text-center space-y-6">
                        <div className="space-y-3">
                            <h2 className="text-2xl font-bold text-foreground">No tienes permisos para acceder a esta página</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Tu rol de usuario actual no tiene los permisos necesarios para ver este contenido. Si crees que esto es
                                un error, contacta con el administrador del sistema.
                            </p>
                        </div>

                        {/* Info Box */}
                        <div className="bg-muted/50 border border-border rounded-xl p-6 space-y-2">
                            <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                <ShieldAlert className="w-5 h-5" />
                                <span className="font-medium">Razones comunes:</span>
                            </div>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Tu rol no tiene acceso a esta sección</li>
                                <li>• Intentaste acceder a una ruta restringida</li>
                                <li>• Tus permisos han sido modificados recientemente</li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Link href="/">
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <Home className="w-5 h-5 mr-2" />
                                    Ir al Inicio
                                </Button>
                            </Link>

                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => window.history.back()}
                                className="w-full sm:w-auto border-2 hover:bg-muted transition-all duration-300"
                            >
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Volver Atrás
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Footer text */}
                <p className="text-center text-sm text-muted-foreground mt-6">
                    Si necesitas acceso a esta sección, contacta con tu administrador
                </p>
            </div>
        </div>
    )
}
