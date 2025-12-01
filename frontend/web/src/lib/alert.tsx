"use client"

import React from "react"
import { createRoot } from "react-dom/client"
import { Button } from "@/components/ui/button"

type AlertOptions = {
    title?: string
    description?: string
    okText?: string
}

function AlertDialog({ title, description, okText, resolve }: any) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-card rounded-lg shadow-lg w-full max-w-md p-6">
                <h3 className="text-lg font-semibold mb-2">{title || "Aviso"}</h3>
                <p className="text-sm text-muted-foreground mb-4">{description || ""}</p>
                <div className="flex justify-end">
                    <Button onClick={() => resolve(true)} className="bg-primary text-white">{okText || "OK"}</Button>
                </div>
            </div>
        </div>
    )
}

export async function showAlert(options: AlertOptions = {}) {
    if (typeof window === "undefined") return

    return new Promise<void>((resolve) => {
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
            resolve()
            clean()
        }

        root.render(
            <AlertDialog
                title={options.title}
                description={options.description}
                okText={options.okText}
                resolve={handleResolve}
            />,
        )
    })
}

export default showAlert
