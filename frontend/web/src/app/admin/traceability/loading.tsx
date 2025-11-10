import { Loader2 } from "lucide-react"

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">Cargando trazabilidad...</p>
            </div>
        </div>
    )
}
