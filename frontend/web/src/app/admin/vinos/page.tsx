"use client"

import { useState, useEffect } from "react"
import { Wine, Plus, Search, Edit, Trash2, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface Vino {
  id_vino: string
  nombre: string
  tipo: string
  anio_cosecha: number
  precio_botella: number
  botellas_por_caja?: number
  meses_barrica?: number
  descripcion?: string
}

export default function VinosPage() {
  const router = useRouter()
  const [vinos, setVinos] = useState<Vino[]>([]) //Lista de vinos
  const [loading, setLoading] = useState(true) // Estado de carga
  const [searchTerm, setSearchTerm] = useState("") // busqueda
  const [showModal, setShowModal] = useState(false)
  const [editingVino, setEditingVino] = useState<Vino | null>(null)

  // Función helper para obtener el token
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  useEffect(() => {
    fetchVinos() //Carga los vinos 
  }, [])

  const fetchVinos = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/vinos", {
        headers: getAuthHeaders()
      })
      if (response.ok) {
        const result = await response.json()
        setVinos(result.data || result)
      } else if (response.status === 401) {
        router.push('/login')
      }
    } catch (error) {
      console.error("Error al cargar vinos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este vino?")) return

    try {
      const response = await fetch(`http://localhost:3001/api/vinos/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      })
      if (response.ok) {
        setVinos(vinos.filter(v => v.id_vino !== id))
      } else if (response.status === 403) {
        alert("No tienes permisos para eliminar vinos")
      }
    } catch (error) {
      console.error("Error al eliminar vino:", error)
    }
  }

  const filteredVinos = vinos.filter(vino =>
    vino.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vino.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const calcularStock = (botellas?: number) => botellas || 0

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8 bg-gradient-to-b from-purple-500 to-purple-400 p-8 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin")}
              className="bg-white/20 p-3 rounded-xl backdrop-blur-sm hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Wine className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Gestión de Vinos</h1>
              <p className="text-white/90 mt-1">Administra tu catálogo de vinos</p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingVino(null)
              setShowModal(true)
            }}
            className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-all flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Nuevo Vino
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8 bg-card p-4 rounded-xl shadow-lg border border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre o tipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="border-l-6 border-purple-500 bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-black/90 text-lg font-semibold">Total Vinos</h3>
          <p className="text-4xl font-bold text-black mt-2">{vinos.length}</p>
        </div>
        <div className="border-l-6 border-green-500 bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-black/90 text-lg font-semibold">Botellas Totales</h3>
          <p className="text-4xl font-bold text-black mt-2">
            {vinos.reduce((acc, v) => acc + calcularStock(v.botellas_por_caja), 0)}
          </p>
        </div>
        <div className="border-l-6 border-orange-500 bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-black/90 text-lg font-semibold">Valor Total</h3>
          <p className="text-4xl font-bold text-black mt-2">
            ${vinos.reduce((acc, v) => acc + (Number(v.precio_botella) * calcularStock(v.botellas_por_caja)), 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Vinos List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-muted-foreground mt-4">Cargando vinos...</p>
        </div>
      ) : filteredVinos.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <Wine className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-xl text-muted-foreground">
            {searchTerm ? "No se encontraron vinos" : "No hay vinos registrados"}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Agregar primer vino
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVinos.map((vino) => (
            <div
              key={vino.id_vino}
              className="bg-card p-6 rounded-xl shadow-lg border border-border hover:shadow-xl transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-card-foreground">{vino.nombre}</h3>
                  <p className="text-muted-foreground">{vino.tipo} - {vino.anio_cosecha}</p>
                </div>
                <Wine className="w-8 h-8 text-purple-500" />
              </div>
              
              {vino.meses_barrica && vino.meses_barrica > 0 && (
                <p className="text-sm text-muted-foreground mb-2"> {vino.meses_barrica} meses en barrica</p>
              )}
              
              {vino.descripcion && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{vino.descripcion}</p>
              )}

              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-2xl font-bold text-purple-600">${Number(vino.precio_botella).toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    {vino.botellas_por_caja || 12} botellas/caja
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingVino(vino)
                    setShowModal(true)
                  }}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(vino.id_vino)}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Component */}
      {showModal && (
        <VinoModal
          vino={editingVino}
          getAuthHeaders={getAuthHeaders}
          onClose={() => {
            setShowModal(false)
            setEditingVino(null)
          }}
          onSuccess={() => {
            fetchVinos()
            setShowModal(false)
            setEditingVino(null)
          }}
        />
      )}
    </div>
  )
}

// Modal Component
function VinoModal({ 
  vino, 
  getAuthHeaders,
  onClose, 
  onSuccess 
}: { 
  vino: Vino | null
  getAuthHeaders: () => Record<string, string>
  onClose: () => void
  onSuccess: () => void
}) {
  const tiposVino = ["Tinto", "Blanco", "Rosado", "Espumoso"]
  
  const [formData, setFormData] = useState({
    nombre: vino?.nombre || "",
    tipo: vino?.tipo || tiposVino[0],
    anio_cosecha: vino?.anio_cosecha || new Date().getFullYear(),
    precio_botella: vino?.precio_botella || 0,
    botellas_por_caja: vino?.botellas_por_caja || 12,
    meses_barrica: vino?.meses_barrica || 0,
    descripcion: vino?.descripcion || "",
  })
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    try {
      const url = vino 
        ? `http://localhost:3001/api/vinos/${vino.id_vino}`
        : "http://localhost:3001/api/vinos"
      
      const dataToSend = {
        nombre: formData.nombre,
        tipo: formData.tipo,
        anio_cosecha: formData.anio_cosecha,
        precio_botella: formData.precio_botella,
        botellas_por_caja: formData.botellas_por_caja || 12,
        meses_barrica: formData.meses_barrica || 0,
        descripcion: formData.descripcion.trim() || null,
      }
      
      console.log("Enviando datos:", dataToSend)
      
      const response = await fetch(url, {
        method: vino ? "PATCH" : "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(dataToSend),
      })

      console.log("Respuesta:", response.status)
      
      if (response.ok) {
        const responseText = await response.text()
        console.log("Vino guardado:", responseText)
        onSuccess() //Aqui se cierra el modal y recarga la lista
      } else if (response.status === 403) {
        setError("No tienes permisos para realizar esta acción. Necesitas ser Encargado de Bodega.")
      } else if (response.status === 401) {
        setError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.")
      } else {
        // Errores del servidor
        const responseText = await response.text()
        try {
          const errorData = responseText ? JSON.parse(responseText) : {}
          setError(`Error: ${errorData.message || errorData.error || response.statusText}`)
        } catch {
          setError(`Error del servidor: ${response.status} - ${responseText || response.statusText}`)
        }
      }
    } catch (error) {
      console.error("Error al guardar vino:", error)
      setError(`Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-card-foreground">
            {vino ? "Editar Vino" : "Nuevo Vino"}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre *</label>
              <input
                type="text"
                required
                maxLength={100}
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Tipo *</label>
              <select
                required
                value={formData.tipo}
                onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {tiposVino.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Año de Cosecha *</label>
              <input
                type="number"
                required
                min="1900"
                max="2100"
                value={formData.anio_cosecha}
                onChange={(e) => setFormData({...formData, anio_cosecha: parseInt(e.target.value) || new Date().getFullYear()})}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Precio por Botella *</label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.precio_botella}
                onChange={(e) => setFormData({...formData, precio_botella: parseFloat(e.target.value) || 0})}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Botellas por Caja</label>
              <input
                type="number"
                min="0"
                value={formData.botellas_por_caja}
                onChange={(e) => setFormData({...formData, botellas_por_caja: parseInt(e.target.value) || 12})}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-muted-foreground mt-1">Por defecto: 12 botellas</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Meses en Barrica</label>
              <input
                type="number"
                min="0"
                value={formData.meses_barrica}
                onChange={(e) => setFormData({...formData, meses_barrica: parseInt(e.target.value) || 0})}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-muted-foreground mt-1">Por defecto: 0 meses</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Descripción</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              rows={3}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors font-semibold"
            >
              {vino ? "Actualizar" : "Crear"} Vino
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}