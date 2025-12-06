# Refactoring Recommendations - Frontend/Web

Este documento contiene recomendaciones de refactorización para mejorar la calidad del código frontend sin afectar la funcionalidad.

## ✅ Completado

### 1. Inputs de cantidad de botellas
**Status:** ✅ COMPLETADO

- `LoteModal.tsx`: Reemplazado Select con input numérico (línea 218-239)
- `InventarioModal.tsx`: Reemplazado Select con input numérico (línea 174-200)

**Beneficios:**
- Mayor flexibilidad para el usuario
- Consistencia con el modal de vinos
- Permite valores personalizados

## 📋 Recomendaciones Pendientes

### 2. Input de capacidad en BarricaModal
**Prioridad:** Media
**Archivo:** `src/components/inventory/BarricaModal.tsx` (líneas 112-128)

**Problema actual:**
```tsx
<Select value={formData.capacidad_litros}>
  <SelectItem value="225">225L (Barrica Bordelesa)</SelectItem>
  <SelectItem value="228">228L (Barrica Borgoña)</SelectItem>
  // ... más opciones predefinidas
</Select>
```

**Sugerencia:**
Cambiar a input numérico similar a los otros modales, permitiendo valores personalizados de capacidad.

### 3. Componente Modal Reutilizable
**Prioridad:** Alta
**Impacto:** Múltiples archivos

**Patrón identificado:**
Todos los modales comparten estructura similar:
- Header con gradiente y título
- Botón de cerrar (X)
- Formulario con espaciado consistente
- Botones de acción (Cancelar/Guardar)

**Archivos afectados:**
- `LoteModal.tsx`
- `InventarioModal.tsx`
- `VinosModal.tsx`
- `CosechaModal.tsx`
- `BarricaModal.tsx`
- `VarietalModal.tsx`
- `VinedoModal.tsx`
- `ControlCalidadModal.tsx`
- `ProcesoProduccionModal.tsx`
- `VentasModal.tsx`
- `VentasDetailModal.tsx`
- `MezclaVinoModal.tsx`

**Propuesta:**
Crear un componente `BaseModal` que encapsule la estructura común:

```tsx
// src/components/ui/base-modal.tsx
interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  gradientColors: string; // e.g., "from-blue-600 to-cyan-600"
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function BaseModal({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  icon, 
  gradientColors, 
  children,
  actions 
}: BaseModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-border">
        {/* Header compartido */}
        <div className={`sticky top-0 bg-gradient-to-r ${gradientColors} text-white p-6 flex items-center justify-between rounded-t-xl`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">{icon}</div>
            <div>
              <h2 className="text-2xl font-bold">{title}</h2>
              {subtitle && <p className="text-white/80 text-sm">{subtitle}</p>}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Contenido */}
        <div className="p-6">
          {children}
        </div>
        
        {/* Acciones opcionales */}
        {actions && <div className="p-6 pt-0">{actions}</div>}
      </div>
    </div>
  );
}
```

**Beneficios:**
- ~300-400 líneas menos de código duplicado
- Mantenimiento centralizado del diseño de modales
- Cambios de estilo se propagan automáticamente
- Mayor consistencia visual

### 4. Componente FormField Reutilizable
**Prioridad:** Media
**Impacto:** Todos los modales

**Patrón identificado:**
Todos los campos de formulario siguen estructura similar:
```tsx
<div className="space-y-2">
  <Label className="flex items-center gap-2">
    <Icon className="h-4 w-4" />
    Campo Label *
  </Label>
  <Input ... />
</div>
```

**Propuesta:**
```tsx
// src/components/ui/form-field.tsx
interface FormFieldProps {
  label: string;
  icon?: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
  iconColor?: string;
}

export function FormField({ label, icon, required, children, iconColor = "text-blue-600" }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-foreground font-semibold">
        {icon && <span className={`h-4 w-4 ${iconColor}`}>{icon}</span>}
        {label} {required && "*"}
      </Label>
      {children}
    </div>
  );
}
```

### 5. Estilos de Botones Consistentes
**Prioridad:** Baja
**Impacto:** Todos los modales

**Observación:**
Existen pequeñas variaciones en los estilos de botones entre modales:
- Algunos usan `Button` component de shadcn/ui
- Otros usan `<button>` nativo con clases inline

**Sugerencia:**
Estandarizar en el componente `Button` de shadcn/ui o crear variantes custom consistentes.

### 6. Manejo de Errores Consistente
**Prioridad:** Baja
**Impacto:** Todos los modales

**Patrón identificado:**
Todos los modales muestran errores con estructura similar:
```tsx
{error && (
  <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-4">
    <p className="text-red-800 dark:text-red-200 text-sm font-medium">{error}</p>
  </div>
)}
```

**Propuesta:**
Crear un componente `ErrorAlert`:
```tsx
// src/components/ui/error-alert.tsx
export function ErrorAlert({ message }: { message: string }) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-4">
      <p className="text-red-800 dark:text-red-200 text-sm font-medium">{message}</p>
    </div>
  );
}
```

### 7. Custom Hooks para Lógica de Modales
**Prioridad:** Media
**Impacto:** Reducción de código duplicado

**Patrón identificado:**
Todos los modales tienen lógica similar:
- Estado del formulario
- Carga inicial de datos
- Validación
- Submit con create/update

**Propuesta:**
```tsx
// src/hooks/useModalForm.ts
export function useModalForm<T>({ 
  isOpen, 
  initialData, 
  createFn, 
  updateFn,
  onSuccess 
}: UseModalFormProps<T>) {
  const [formData, setFormData] = useState<T>(initialData);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
      setError("");
    }
  }, [isOpen, initialData]);
  
  const handleSubmit = async (e: React.FormEvent, validate: () => boolean) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    const isUpdate = initialData?.id;
    const result = isUpdate ? await updateFn(initialData.id, formData) : await createFn(formData);
    setLoading(false);
    
    if (result?.success) {
      onSuccess();
    } else {
      setError(result?.errorMessage || "Error desconocido");
    }
  };
  
  return { formData, setFormData, error, setError, loading, handleSubmit };
}
```

### 8. Tipos TypeScript Más Específicos
**Prioridad:** Media
**Impacto:** Seguridad de tipos

**Problema actual:**
Muchos componentes usan `any` para props:
```tsx
cosecha?: any
barrica?: any
inventario?: any
```

**Sugerencia:**
Usar tipos definidos en la carpeta `types/`:
```tsx
import type { Cosecha } from "@/types/traceability"
import type { Barrica } from "@/types/inventory"

interface CosechaModalProps {
  cosecha?: Cosecha;
  // ...
}
```

## 📊 Impacto Estimado

### Código Reducido
- Componente BaseModal: ~300-400 líneas
- FormField component: ~150-200 líneas
- ErrorAlert component: ~50-100 líneas
- Custom hooks: ~200-300 líneas
- **Total estimado:** 700-1000 líneas de código menos

### Mantenibilidad
- Cambios de diseño centralizados
- Menor probabilidad de bugs
- Onboarding más rápido para nuevos desarrolladores
- Testing más sencillo

### Performance
- No hay impacto negativo esperado
- Posible mejora con memoización en componentes compartidos

## 🚀 Plan de Implementación Sugerido

1. **Fase 1 (Crítico):** Completar cambios de inputs (✅ DONE)
2. **Fase 2:** Crear BaseModal y migrar 2-3 modales como prueba
3. **Fase 3:** Migrar resto de modales al BaseModal
4. **Fase 4:** Implementar FormField y ErrorAlert
5. **Fase 5:** Extraer custom hooks
6. **Fase 6:** Mejorar tipos TypeScript

## ⚠️ Consideraciones

- Todos los cambios propuestos son **no breaking**
- Se puede implementar gradualmente
- Mantener tests actualizados durante refactoring
- Hacer commits pequeños y atómicos
- Realizar code review de cada fase

## 📝 Notas Adicionales

- Los gradientes de colores son distintivos por tipo de modal (azul para lotes, morado para cosechas, etc.)
- Mantener esta identidad visual en el BaseModal usando el prop `gradientColors`
- Considerar agregar animaciones consistentes en todos los modales
