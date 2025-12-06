"use client"

import type React from "react"
import { Label } from "@/components/ui/label"

interface FormFieldProps {
    label: string
    icon?: React.ReactNode
    required?: boolean
    children: React.ReactNode
    iconColor?: string
    htmlFor?: string
}

export function FormField({
    label,
    icon,
    required = false,
    children,
    iconColor = "text-blue-600",
    htmlFor,
}: FormFieldProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={htmlFor} className="flex items-center gap-2 text-foreground font-semibold">
                {icon && <span className={`h-4 w-4 ${iconColor}`}>{icon}</span>}
                {label} {required && "*"}
            </Label>
            {children}
        </div>
    )
}
