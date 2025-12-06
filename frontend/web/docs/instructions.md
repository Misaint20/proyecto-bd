# Instrucciones de Inicialización del Frontend

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 22 o superior)
- **npm** (viene con Node.js)
- **Git**
- **Backend funcionando** - El frontend necesita comunicarse con el backend para funcionar correctamente

## Pasos de Instalación

### 1. Clonar el Repositorio

Si aún no has clonado el repositorio, sigue estos pasos:

Primero, crea un fork del repositorio en tu cuenta de GitHub haciendo clic en el botón "Fork" en la parte superior derecha de la página del repositorio.

Luego, clona el repositorio en tu computadora local:

```bash
git clone https://github.com/tu-usuario/proyecto-bd.git
```

**Nota:** Reemplaza `tu-usuario` con tu nombre de usuario de GitHub.

### 2. Navegar al Directorio del Frontend

```bash
cd proyecto-bd/frontend/web
```

### 3. Instalar Dependencias

Instala todas las dependencias del proyecto usando npm:

```bash
npm install
```

Este comando instalará todas las dependencias listadas en `package.json`, incluyendo:
- Next.js 16 (framework de React)
- React 19
- TailwindCSS (para estilos)
- Radix UI (componentes de UI)
- Axios (para peticiones HTTP)
- Y otras dependencias necesarias

### 4. Configurar Variables de Entorno

Crea un archivo `.env.local` en el directorio `frontend/web` con la siguiente configuración:

```env
BACKEND_URL=http://localhost:4000
```

**Nota:** Ajusta el puerto según la configuración de tu backend. Si tu backend está corriendo en un puerto diferente, actualiza la URL correspondiente.

**Otros ejemplos de configuración:**

- **Backend en puerto diferente:**
  ```
  BACKEND_URL=http://localhost:4000
  ```

- **Backend en red local:**
  ```
  BACKEND_URL=http://192.168.1.100:4000
  ```

### 5. Verificar que el Backend esté Funcionando

Antes de iniciar el frontend, asegúrate de que el backend esté corriendo. Puedes verificar esto accediendo a la URL del backend en tu navegador o usando curl:

```bash
curl http://localhost:4000
```

Si obtienes una respuesta, el backend está funcionando correctamente.

### 6. Iniciar el Servidor de Desarrollo

Inicia el servidor de Next.js en modo desarrollo:

```bash
npm run dev
```

El servidor se iniciará con Turbopack (el empaquetador ultrarrápido de Next.js) y estará disponible en `http://localhost:3000` (o el siguiente puerto disponible si 3000 está en uso por el backend).

**Nota:** Next.js automáticamente detectará si el puerto 3000 está en uso y sugerirá usar otro puerto.

## Verificación

Para verificar que todo está funcionando correctamente:

1. El servidor debería mostrar un mensaje indicando que está escuchando en el puerto correspondiente
2. Abre tu navegador y accede a `http://localhost:3000` (o el puerto que se muestre en la terminal)
3. Deberías ver la aplicación web cargada
4. Verifica que no haya errores en la consola del navegador (presiona F12)
5. Comprueba que la aplicación pueda comunicarse con el backend

## Scripts Disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo con Turbopack y recarga automática
- `npm run build` - Compila el proyecto para producción
- `npm start` - Inicia el servidor en modo producción (requiere ejecutar `build` primero)

## Estructura del Proyecto

El frontend está construido con Next.js 16 utilizando el App Router:

- `app/` - Directorio principal de la aplicación (rutas y páginas)
- `components/` - Componentes React reutilizables
- `lib/` - Utilidades y funciones auxiliares
- `public/` - Archivos estáticos (imágenes, etc.)
- `styles/` - Archivos de estilos CSS

## Tecnologías Utilizadas

- **Next.js 16** - Framework de React para producción
- **React 19** - Biblioteca para construir interfaces de usuario
- **TypeScript** - JavaScript con tipado estático
- **TailwindCSS 4** - Framework de CSS utility-first
- **Radix UI** - Componentes accesibles y sin estilos
- **Axios** - Cliente HTTP para peticiones al backend
- **Lucide React** - Biblioteca de iconos
- **next-themes** - Soporte para tema claro/oscuro
- **jose** - Manejo de JWT (JSON Web Tokens)

## Solución de Problemas

### Error de conexión con el backend

- Verifica que el backend esté ejecutándose
- Confirma que la URL en el archivo `.env.local` sea correcta
- Asegúrate de que no haya problemas de CORS en el backend
- Revisa la consola del navegador (F12) para ver errores específicos

### El puerto está en uso

Si el puerto está en uso, Next.js te preguntará si deseas usar otro puerto. Simplemente responde "Y" (yes) para usar el puerto alternativo sugerido.

### Errores de dependencias

Si encuentras errores al instalar dependencias:

```bash
# Limpia la caché de npm
npm cache clean --force

# Elimina node_modules y package-lock.json
rm -rf node_modules package-lock.json

# Vuelve a instalar
npm install
```

### La página no se actualiza automáticamente

Turbopack debería proporcionar actualización en caliente (hot reload). Si no funciona:
- Guarda el archivo nuevamente
- Recarga la página manualmente (Ctrl+R o Cmd+R)
- Reinicia el servidor de desarrollo

### Errores de TypeScript

Si ves errores de TypeScript en tu editor pero la aplicación funciona:
- Reinicia tu editor de código (VS Code, WebStorm, etc.)
- Ejecuta `npm run build` para verificar si hay errores reales

## Desarrollo

### Hot Reload

El servidor de desarrollo incluye Hot Module Replacement (HMR), lo que significa que los cambios que hagas en el código se reflejarán automáticamente en el navegador sin necesidad de recargar la página completa.

### Estilos con TailwindCSS

Este proyecto utiliza TailwindCSS 4 para los estilos. Puedes aplicar clases de utilidad directamente en tus componentes:

```tsx
<div className="flex items-center justify-center p-4 bg-blue-500 text-white">
  Contenido
</div>
```

### Componentes de UI

El proyecto utiliza Radix UI para componentes accesibles. Puedes encontrar componentes pre-construidos en el directorio `components/ui/`.

## Siguiente Paso

Una vez que el frontend esté funcionando correctamente:

1. Prueba las diferentes funcionalidades de la aplicación
2. Verifica que la comunicación con el backend funcione
3. Revisa la documentación del backend en `backend/docs/instructions.md` si necesitas información sobre las APIs disponibles

## Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de React](https://react.dev)
- [Documentación de TailwindCSS](https://tailwindcss.com/docs)
- [Documentación de Radix UI](https://www.radix-ui.com/primitives)
- [Documentación de TypeScript](https://www.typescriptlang.org/docs)
