"use client"

import type React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BaseModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    subtitle?: string
    icon: React.ReactNode
    gradientColors: string
    children: React.ReactNode
    maxWidth?: string
}

export function BaseModal({
    isOpen,
    onClose,
    title,
    subtitle,
    icon,
    gradientColors,
    children,
    maxWidth = "max-w-2xl",
}: BaseModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className={`bg-card rounded-2xl shadow-2xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 border border-border`}>
                {/* Header */}
                <div className={`bg-gradient-to-r ${gradientColors} text-white p-6 rounded-t-2xl`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                                {icon}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{title}</h2>
                                {subtitle && <p className="text-white/90 text-sm mt-1">{subtitle}</p>}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-all hover:scale-110"
                            type="button"
                        >
                            <X className="h-5 w-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    )
}
