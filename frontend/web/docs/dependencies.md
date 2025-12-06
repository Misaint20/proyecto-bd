# Dependencias del Frontend

Este documento describe las principales dependencias utilizadas en el frontend del proyecto.

## Dependencias de Producción

### Framework Principal

#### Next.js (v16.0.7)
[Next.js](https://nextjs.org/) es el framework de React para producción. Proporciona:
- Renderizado híbrido (SSR, SSG, ISR)
- Enrutamiento basado en sistema de archivos
- App Router moderno
- Optimización automática de imágenes
- Bundling y minificación
- Turbopack para builds ultrarrápidos
- API Routes integradas

**Características utilizadas:**
- App Router (estructura `app/`)
- Server Components
- Client Components
- Middleware
- Turbopack para desarrollo rápido

#### React (v19.2.1)
[React](https://react.dev) es la biblioteca principal para construir interfaces de usuario. Características:
- Componentes reutilizables
- Hooks para gestión de estado
- Virtual DOM para rendimiento óptimo
- React Server Components (nuevo en v19)
- Actions y mejoras de rendimiento

#### React DOM (v19.2.1)
[React DOM](https://react.dev) proporciona métodos específicos del DOM para React:
- Renderizado en el navegador
- Hidratación de componentes
- Gestión de eventos
- Integración con Next.js

### Estilos y UI

#### TailwindCSS (v4.1.14)
[TailwindCSS](https://tailwindcss.com/) es un framework CSS utility-first. Características:
- Clases de utilidad para estilos rápidos
- Diseño responsive sin media queries complejas
- Purge automático de CSS no utilizado
- Sistema de diseño consistente
- Personalización completa

**Plugins utilizados:**
- `@tailwindcss/postcss` - Integración con PostCSS
- `tw-animate-css` - Animaciones predefinidas

#### Radix UI
[Radix UI](https://www.radix-ui.com/) proporciona componentes accesibles y sin estilos:

##### @radix-ui/react-avatar (v1.1.11)
Componente de avatar con fallback automático.

##### @radix-ui/react-dropdown-menu (v2.1.16)
Menú desplegable completamente accesible con teclado.

##### @radix-ui/react-label (v2.1.7)
Etiquetas de formulario accesibles.

##### @radix-ui/react-select (v2.2.6)
Select customizable con búsqueda y accesibilidad.

##### @radix-ui/react-slot (v1.2.3)
Utilidad para composición de componentes.

### HTTP y Comunicación

#### Axios (v1.13.0)
[Axios](https://axios-http.com/) es un cliente HTTP basado en promesas. Se utiliza para:
- Peticiones al backend
- Interceptores de request/response
- Manejo de errores centralizado
- Transformación automática de JSON
- Cancelación de peticiones

### Utilidades y Helpers

#### clsx (v2.1.1)
[clsx](https://www.npmjs.com/package/clsx) construye strings de clases CSS condicionalmente:
- Combinación de clases dinámicas
- Sintaxis limpia y expresiva
- Rendimiento optimizado

#### class-variance-authority (v0.7.1)
[CVA](https://cva.style/) crea variantes de componentes con TypeScript:
- Variantes de estilos tipadas
- Composición de estilos
- IntelliSense completo

#### tailwind-merge (v3.3.1)
[tailwind-merge](https://www.npmjs.com/package/tailwind-merge) combina clases de Tailwind sin conflictos:
- Resuelve conflictos de clases
- Mantiene la precedencia correcta
- Optimiza el output final

### Autenticación y Seguridad

#### jose (v6.1.2)
[jose](https://www.npmjs.com/package/jose) es una biblioteca para trabajar con JWT:
- Verificación de tokens JWT
- Generación de tokens
- Soporte para Edge Runtime
- Compatible con Next.js Middleware

#### cookie (v1.0.2)
[cookie](https://www.npmjs.com/package/cookie) maneja cookies en el navegador:
- Parsing de cookies
- Serialización
- Configuración de atributos (secure, httpOnly, etc.)

### Iconos y Tema

#### lucide-react (v0.546.0)
[Lucide](https://lucide.dev/) es una biblioteca de iconos SVG:
- Más de 1000 iconos
- Componentes React optimizados
- Totalmente personalizables
- Ligeros y escalables

#### next-themes (v0.4.6)
[next-themes](https://www.npmjs.com/package/next-themes) gestiona temas claro/oscuro:
- Cambio de tema sin parpadeo
- Persistencia automática
- Compatible con SSR
- Detección de preferencia del sistema

### Desarrollo

#### next-devtools-mcp (v0.2.3)
Herramientas de desarrollo para Next.js:
- Inspección de componentes
- Monitoreo de rendimiento
- Debugging mejorado

## Dependencias de Desarrollo

### TypeScript y Tipos

#### TypeScript (v5.x)
[TypeScript](https://www.typescriptlang.org/) proporciona tipado estático:
- Prevención de errores en tiempo de desarrollo
- Mejor autocompletado e IntelliSense
- Refactorización segura
- Documentación implícita

#### @types/node (v20.x)
Definiciones de tipos para Node.js API.

#### @types/react (v19.2.7)
Definiciones de tipos para React.

#### @types/react-dom (v19.2.3)
Definiciones de tipos para React DOM.

### Build Tools

#### PostCSS (v8.5.6)
[PostCSS](https://postcss.org/) procesa CSS con JavaScript:
- Transformación de CSS
- Autoprefixer integrado
- Optimización de CSS

#### Autoprefixer (v10.4.21)
[Autoprefixer](https://www.npmjs.com/package/autoprefixer) añade prefijos de navegador:
- Compatibilidad cross-browser automática
- Basado en Can I Use
- Optimización de prefijos

#### baseline-browser-mapping (v2.8.32)
Mapeo de navegadores para compatibilidad baseline.

## Arquitectura de Dependencias

```
Next.js 16 (Framework)
├── React 19 (UI Library)
│   ├── Radix UI (Componentes)
│   ├── lucide-react (Iconos)
│   └── next-themes (Temas)
├── TailwindCSS 4 (Estilos)
│   ├── clsx (Clases condicionales)
│   ├── CVA (Variantes)
│   └── tailwind-merge (Merge)
├── Axios (HTTP Client)
├── jose (JWT)
└── cookie (Cookies)

TypeScript (Type System)
├── @types/react
├── @types/react-dom
└── @types/node

Build Tools
├── PostCSS
├── Autoprefixer
└── Turbopack (integrado en Next.js)
```

## Scripts de Gestión

Para instalar todas las dependencias:
```bash
npm install
```

Para actualizar dependencias:
```bash
npm update
```

Para verificar dependencias obsoletas:
```bash
npm outdated
```

Para auditar vulnerabilidades de seguridad:
```bash
npm audit
```

Para arreglar vulnerabilidades automáticamente:
```bash
npm audit fix
```

## Características Destacadas

### Turbopack
Next.js 16 incluye Turbopack, un bundler escrito en Rust que es:
- 700x más rápido que Webpack en grandes proyectos
- Compilación incremental ultrarrápida
- Hot Module Replacement instantáneo
- Optimización automática de producción

### React 19
Esta versión incluye:
- React Server Components estables
- Actions para mutaciones
- use() hook para promesas
- Mejoras de rendimiento significativas
- Mejor soporte para Suspense

### App Router
El App Router de Next.js proporciona:
- Layouts anidados
- Loading states
- Error boundaries
- Streaming SSR
- Server Components por defecto
- Colocation de código

### TailwindCSS 4
Nuevas características:
- Motor CSS mejorado
- Mejor rendimiento
- Sintaxis simplificada
- Nuevas utilidades
- Mejor integración con PostCSS

## Gestión de Overrides

El proyecto utiliza `overrides` en `package.json` para:
```json
"overrides": {
  "@types/react": "19.2.7",
  "@types/react-dom": "19.2.3"
}
```

Esto asegura que todas las dependencias usen las versiones correctas de tipos de React 19, evitando conflictos de tipos.

## Compatibilidad

### Navegadores Soportados
- Chrome/Edge (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- Safari (últimas 2 versiones)
- iOS Safari (últimas 2 versiones)

### Node.js
- Versión mínima: 18.x
- Versión recomendada: 20.x o superior

## Notas de Versiones

- **Next.js 16** introduce Turbopack estable y mejoras de rendimiento
- **React 19** es una versión mayor con breaking changes menores
- **TailwindCSS 4** requiere PostCSS actualizado
- **Radix UI v2** tiene mejor accesibilidad y rendimiento
- Todas las dependencias se mantienen actualizadas para seguridad y rendimiento

## Optimizaciones

### Bundle Size
Next.js automáticamente:
- Tree-shaking de código no usado
- Code splitting por ruta
- Lazy loading de componentes
- Compresión de assets
- Optimización de imágenes

### Performance
- Server Components reducen el JavaScript del cliente
- Streaming SSR para TTFB rápido
- Prefetching automático de rutas
- Optimización de fuentes con next/font
- Caching inteligente

## Recursos Adicionales

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/primitives)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Axios Documentation](https://axios-http.com/docs)
