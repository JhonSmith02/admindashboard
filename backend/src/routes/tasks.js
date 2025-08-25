// src/routes/tasks.js
import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import {
  getMyTasks,
  listTasks,
  getTasksByUser,
  createTask,
  updateTask,
  deleteTask,
  getProjects
} from '../controllers/tasksController.js';

const router = express.Router();

// GET /api/tasks/my - Obtener tareas del usuario autenticado
router.get('/my', authenticateToken, getMyTasks);

// GET /api/tasks/projects - Obtener lista de proyectos
router.get('/projects', authenticateToken, getProjects);

// GET /api/tasks - Listar todas las tareas (solo admin)
router.get('/', authenticateToken, requireRole('admin'), listTasks);

// GET /api/tasks/user/:userId - Obtener tareas de un usuario específico (solo admin)
router.get('/user/:userId', authenticateToken, requireRole('admin'), getTasksByUser);

// POST /api/tasks - Crear nueva tarea (solo admin)
router.post('/', authenticateToken, requireRole('admin'), createTask);

// PUT /api/tasks/:id - Actualizar tarea (admin o usuario asignado)
router.put('/:id', authenticateToken, updateTask);

// DELETE /api/tasks/:id - Eliminar tarea (solo admin)
router.delete('/:id', authenticateToken, requireRole('admin'), deleteTask);

export default router;