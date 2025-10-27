// src/routes/ReportesRoutes.ts
import { Router } from 'express';
import * as ReportesController from '../controllers/ReportesController';
import { authenticateJWT } from '../middlewares/AuthMiddleware';
import { authorizeRoles } from '../middlewares/RoleMiddleware';
import { Rol_nombre as RolNombre } from '@prisma/client';

const router = Router();

// Aplicar autenticación JWT a todas las rutas de Reportes
router.use(authenticateJWT); 
// Los reportes analíticos son exclusivamente para el Administrador (RNF04)
router.use(authorizeRoles(RolNombre.Administrador)); 

// Rutas de Reportes (RF03)
router.get('/inventario/valorizado', ReportesController.getInventarioValorizado);
router.get('/ventas/periodo', ReportesController.getReporteVentasPorPeriodo);


export default router;