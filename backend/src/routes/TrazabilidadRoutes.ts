import { Router } from 'express';
import * as TrazabilidadController from '../controllers/TrazabilidadController';
// Importación de seguridad para proteger las rutas de Trazabilidad (RF02)
import { authenticateJWT } from '../middlewares/AuthMiddleware';
import { authorizeRoles } from '../middlewares/RoleMiddleware';
import { Rol_nombre as RolNombre } from '@prisma/client';

const router = Router();

// Aplicar autenticación JWT a todas las rutas de trazabilidad
router.use(authenticateJWT); 

// Rutas de Cosecha (RF02)
// Crear, Actualizar, Eliminar requieren Enólogo/Productor o Administrador
router.post('/cosechas', authorizeRoles(RolNombre.Enologo_Productor), TrazabilidadController.createCosecha);
router.get('/cosechas', TrazabilidadController.getCosechas);
router.patch('/cosechas/:id', authorizeRoles(RolNombre.Enologo_Productor), TrazabilidadController.updateCosecha);
router.delete('/cosechas/:id', authorizeRoles(RolNombre.Administrador), TrazabilidadController.deleteCosecha);

// Rutas de Lote (RF02)
router.post('/lotes', authorizeRoles(RolNombre.Enologo_Productor), TrazabilidadController.createLote);
router.get('/lotes', TrazabilidadController.getLotes);
router.patch('/lotes/:id', authorizeRoles(RolNombre.Enologo_Productor), TrazabilidadController.updateLote);
router.delete('/lotes/:id', authorizeRoles(RolNombre.Administrador), TrazabilidadController.deleteLote);

// Rutas de Proceso de Producción (RF02)
router.post('/procesos', authorizeRoles(RolNombre.Enologo_Productor), TrazabilidadController.createProcesoProduccion);
router.get('/procesos', TrazabilidadController.getProcesosProduccion);
router.patch('/procesos/:id', authorizeRoles(RolNombre.Enologo_Productor), TrazabilidadController.updateProcesoProduccion);
router.delete('/procesos/:id', authorizeRoles(RolNombre.Administrador), TrazabilidadController.deleteProcesoProduccion);

// Rutas de Control de Calidad (RF02)
router.post('/calidad', authorizeRoles(RolNombre.Enologo_Productor), TrazabilidadController.createControlCalidad);
router.get('/calidad', TrazabilidadController.getControlesCalidad);
router.patch('/calidad/:id', authorizeRoles(RolNombre.Enologo_Productor), TrazabilidadController.updateControlCalidad);
router.delete('/calidad/:id', authorizeRoles(RolNombre.Enologo_Productor), TrazabilidadController.deleteControlCalidad);

export default router;