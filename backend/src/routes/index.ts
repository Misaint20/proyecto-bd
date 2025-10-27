export const routes = [
    {
        path: '/api/auth',
        name: 'auth',
        module: import('./AuthRoutes'),
    },
    {
        path: '/api/usuarios',
        name: 'usuarios',
        module: import('./UsuarioRoutes'),
    },
    {
        path: '/api/vinos',
        name: 'vinos',
        module: import('./VinoRoutes'),
    },
    {
        path: '/api/maestros',
        name: 'maestros',
        module: import('./MaestrosRoutes'),
    },
    {
        path: '/api/inventario',
        name: 'inventario',
        module: import('./InventarioRoutes'),
    },
    {
        path: '/api/trazabilidad',
        name: 'trazabilidad',
        module: import('./TrazabilidadRoutes'),
    },
    {
        path: '/api/ventas',
        name: 'ventas',
        module: import('./VentasRoutes'),
    },
    {
        path: '/api/reportes',
        name: 'reportes',
        module: import('./ReportesRoutes'),
    
    }
];