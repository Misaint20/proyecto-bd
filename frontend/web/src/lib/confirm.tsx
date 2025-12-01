"use client"

import React from "react"
import { createRoot } from "react-dom/client"
import { Button } from "@/components/ui/button"

type ConfirmOptions = {
    title?: string
    description?: string
    confirmText?: string
    cancelText?: string
}

function ConfirmDialog({ title, description, confirmText, cancelText, resolve }: any) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-card rounded-lg shadow-lg w-full max-w-md p-6">
                <h3 className="text-lg font-semibold mb-2">{title || "Confirmar acción"}</h3>
                <p className="text-sm text-muted-foreground mb-4">{description || "¿Estás seguro?"}</p>
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => resolve(false)}>{cancelText || "Cancelar"}</Button>
                    <Button onClick={() => resolve(true)} className="bg-red-600 hover:bg-red-700 text-white">{confirmText || "Confirmar"}</Button>
                </div>
            </div>
        </div>
    )
}

export async function confirm(options: ConfirmOptions = {}) {
    if (typeof window === "undefined") return false

    return new Promise<boolean>((resolve) => {
        const container = document.createElement("div")
        document.body.appendChild(container)

        const root = createRoot(container)

        const clean = () => {
            try {
                root.unmount()
            } catch (_) {}
            if (container.parentNode) container.parentNode.removeChild(container)
        }

        const handleResolve = (value: boolean) => {
            resolve(value)
            clean()
        }

        root.render(
            <ConfirmDialog
                title={options.title}
                description={options.description}
                confirmText={options.confirmText}
                cancelText={options.cancelText}
                resolve={handleResolve}
            />,
        )
    })
}

export default confirm
