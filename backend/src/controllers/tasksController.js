// src/controllers/tasksController.js
import pool from '../config/db.js';

/**
 * GET /api/tasks/my
 * Obtener tareas del usuario autenticado
 */
export async function getMyTasks(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT t.id, t.title, t.description, t.status, t.priority, t.due_date as dueDate, 
              t.created_at, t.updated_at, p.name as project
       FROM tasks t
       LEFT JOIN projects p ON t.project_id = p.id
       WHERE t.assigned_to = ?
       ORDER BY t.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error cargando tareas', err);
    res.status(500).json({ error: 'Error interno' });
  }
}

/**
 * GET /api/tasks
 * Solo admin: listar todas las tareas
 */
export async function listTasks(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT t.id, t.title, t.description, t.status, t.priority, t.due_date as dueDate,
              t.created_at, t.updated_at,
              u.name as assignedTo, u.id as assignedToId,
              p.name as project, p.id as projectId
       FROM tasks t
       LEFT JOIN users u ON t.assigned_to = u.id
       LEFT JOIN projects p ON t.project_id = p.id
       ORDER BY t.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('listTasks', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /api/tasks/user/:userId
 * Solo admin: obtener tareas de un usuario específico
 */
export async function getTasksByUser(req, res) {
  try {
    const { userId } = req.params;
    
    const [rows] = await pool.query(
      `SELECT t.id, t.title, t.description, t.status, t.priority, t.due_date as dueDate,
              t.created_at, t.updated_at,
              p.name as project, p.id as projectId
       FROM tasks t
       LEFT JOIN projects p ON t.project_id = p.id
       WHERE t.assigned_to = ?
       ORDER BY t.created_at DESC`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('getTasksByUser', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * POST /api/tasks
 * Solo admin: crear nueva tarea
 */
export async function createTask(req, res) {
  try {
    const { title, description, assignedTo, projectId, priority = 'Media', dueDate } = req.body;

    if (!title || !assignedTo) {
      return res.status(400).json({ error: 'Title and assignedTo are required' });
    }

    // Verificar que el usuario asignado existe
    const [userCheck] = await pool.query('SELECT id FROM users WHERE id = ?', [assignedTo]);
    if (userCheck.length === 0) {
      return res.status(400).json({ error: 'Assigned user does not exist' });
    }

    // Verificar que el proyecto existe (si se proporciona)
    if (projectId) {
      const [projectCheck] = await pool.query('SELECT id FROM projects WHERE id = ?', [projectId]);
      if (projectCheck.length === 0) {
        return res.status(400).json({ error: 'Project does not exist' });
      }
    }

    const [result] = await pool.query(
      `INSERT INTO tasks (title, description, assigned_to, project_id, priority, due_date, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 'Pendiente', NOW(), NOW())`,
      [title, description, assignedTo, projectId || null, priority, dueDate || null]
    );

    // Obtener la tarea creada con información relacionada
    const [newTask] = await pool.query(
      `SELECT t.id, t.title, t.description, t.status, t.priority, t.due_date as dueDate,
              t.created_at, t.updated_at,
              u.name as assignedTo, u.id as assignedToId,
              p.name as project, p.id as projectId
       FROM tasks t
       LEFT JOIN users u ON t.assigned_to = u.id
       LEFT JOIN projects p ON t.project_id = p.id
       WHERE t.id = ?`,
      [result.insertId]
    );

    res.status(201).json(newTask[0]);
  } catch (err) {
    console.error('createTask', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * PUT /api/tasks/:id
 * Admin o usuario asignado: actualizar tarea
 */
export async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate, projectId } = req.body;

    // Verificar que la tarea existe
    const [existingTask] = await pool.query('SELECT assigned_to FROM tasks WHERE id = ?', [id]);
    if (existingTask.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Verificar permisos (admin o usuario asignado)
    const isAdmin = req.user.role === 'admin';
    const isAssigned = Number(req.user.id) === Number(existingTask[0].assigned_to);
    
    if (!isAdmin && !isAssigned) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Construir la consulta de actualización dinámicamente
    const updateFields = [];
    const updateValues = [];

    if (title) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (status) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }
    if (priority) {
      updateFields.push('priority = ?');
      updateValues.push(priority);
    }
    if (dueDate !== undefined) {
      updateFields.push('due_date = ?');
      updateValues.push(dueDate);
    }
    if (projectId !== undefined) {
      updateFields.push('project_id = ?');
      updateValues.push(projectId);
    }

    updateFields.push('updated_at = NOW()');
    updateValues.push(id);

    if (updateFields.length === 1) { // Solo updated_at
      return res.status(400).json({ error: 'No fields to update' });
    }

    await pool.query(
      `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Obtener la tarea actualizada
    const [updatedTask] = await pool.query(
      `SELECT t.id, t.title, t.description, t.status, t.priority, t.due_date as dueDate,
              t.created_at, t.updated_at,
              u.name as assignedTo, u.id as assignedToId,
              p.name as project, p.id as projectId
       FROM tasks t
       LEFT JOIN users u ON t.assigned_to = u.id
       LEFT JOIN projects p ON t.project_id = p.id
       WHERE t.id = ?`,
      [id]
    );

    res.json(updatedTask[0]);
  } catch (err) {
    console.error('updateTask', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * DELETE /api/tasks/:id
 * Solo admin: eliminar tarea
 */
export async function deleteTask(req, res) {
  try {
    const { id } = req.params;

    // Verificar que la tarea existe
    const [existingTask] = await pool.query('SELECT id, title FROM tasks WHERE id = ?', [id]);
    if (existingTask.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Eliminar la tarea
    await pool.query('DELETE FROM tasks WHERE id = ?', [id]);

    res.json({
      message: 'Task deleted successfully',
      deletedTask: existingTask[0]
    });
  } catch (err) {
    console.error('deleteTask', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /api/tasks/projects
 * Obtener lista de proyectos disponibles
 */
export async function getProjects(req, res) {
  try {
    const [rows] = await pool.query('SELECT id, name, description FROM projects ORDER BY name ASC');
    res.json(rows);
  } catch (err) {
    console.error('getProjects', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}