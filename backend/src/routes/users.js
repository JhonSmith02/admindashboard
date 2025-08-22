import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { 
  listUsers, 
  getMe, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} from '../controllers/usersControllers.js';

const router = express.Router();

// GET /api/users - Listar todos los usuarios (solo admin)
router.get('/', authenticateToken, requireRole('admin'), listUsers);

// GET /api/users/me - Obtener perfil propio
router.get('/me', authenticateToken, getMe);

// POST /api/users - Crear nuevo usuario (solo admin)
router.post('/', authenticateToken, requireRole('admin'), createUser);

// GET /api/users/:id - Obtener usuario por ID (admin o propio perfil)
router.get('/:id', authenticateToken, getUserById);

// PUT /api/users/:id - Actualizar usuario (solo admin)
router.put('/:id', authenticateToken, requireRole('admin'), updateUser);

// DELETE /api/users/:id - Eliminar usuario (solo admin)
router.delete('/:id', authenticateToken, requireRole('admin'), deleteUser);

export default router;