"use client"

import { useEffect, useState } from "react"

export type ServiceResult<T = any> = Promise<{ success: boolean; data?: T; errorMessage?: string }>

type UseModalFormProps<T> = {
    isOpen: boolean
    initialData: T | null
    createFn: (data: T) => ServiceResult
    updateFn: (id: any, data: T) => ServiceResult
    getId?: (data: T) => any
    onSuccess?: () => void
}

export function useModalForm<T>({ isOpen, initialData, createFn, updateFn, getId, onSuccess }: UseModalFormProps<T>) {
    const [formData, setFormData] = useState<T | null>(initialData)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData)
            setError("")
        }
    }, [isOpen, initialData])

    const handleSubmit = async (validate: () => boolean) => {
        if (!validate()) return
        setLoading(true)
        setError("")

        try {
            const id = formData && getId ? getId(formData) : null
            const result = id ? await updateFn(id, formData as T) : await createFn(formData as T)

            if (result && result.success) {
                onSuccess && onSuccess()
                setLoading(false)
                return { success: true }
            }

            setError(result?.errorMessage || "Error desconocido")
            setLoading(false)
            return { success: false }
        } catch (e: any) {
            setError(e?.message || "Error desconocido")
            setLoading(false)
            return { success: false }
        }
    }

    return { formData, setFormData, error, setError, loading, handleSubmit }
}
