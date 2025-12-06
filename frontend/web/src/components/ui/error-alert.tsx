"use client"

interface ErrorAlertProps {
    message: string
}

export function ErrorAlert({ message }: ErrorAlertProps) {
    if (!message) return null

    return (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200 text-sm font-medium">{message}</p>
        </div>
    )
}
