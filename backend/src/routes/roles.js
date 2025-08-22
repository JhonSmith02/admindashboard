// src/routes/roles.js
import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import {
  listRoles,
  createRole,
  updateRole,
  deleteRole,
  getUsersByRole
} from '../controllers/rolesController.js';

const router = express.Router();

// GET /api/roles - Listar todos los roles (solo admin)
router.get('/', authenticateToken, requireRole('admin'), listRoles);

// POST /api/roles - Crear nuevo rol (solo admin)
router.post('/', authenticateToken, requireRole('admin'), createRole);

// PUT /api/roles/:id - Actualizar rol (solo admin)
router.put('/:id', authenticateToken, requireRole('admin'), updateRole);

// DELETE /api/roles/:id - Eliminar rol (solo admin)
router.delete('/:id', authenticateToken, requireRole('admin'), deleteRole);

// GET /api/roles/:id/users - Obtener usuarios por rol (solo admin)
router.get('/:id/users', authenticateToken, requireRole('admin'), getUsersByRole);

export default router;