"use client"

import { useState } from "react"
import { fetchData } from "@/lib/fetchData"
import { getUsers } from "@/services/UsersService"
import { Card } from "@/components/ui/card"

export default function VendedorClientesPage() {
    const [users, setUsers] = useState<any[]>([])

    fetchData(getUsers, (data: any[]) => setUsers(data), "clientes-vendedor")

    return (
        <div className="min-h-screen p-6 bg-background">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Clientes</h1>
                <p className="text-sm text-muted-foreground">Listado básico de clientes</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {users.map((u) => (
                    <Card key={u.id_usuario} className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold">{u.nombre || u.email || `Usuario ${u.id_usuario}`}</p>
                                <p className="text-sm text-muted-foreground">{u.email || '—'}</p>
                            </div>
                            <div className="text-sm text-muted-foreground">{u.role || ''}</div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
