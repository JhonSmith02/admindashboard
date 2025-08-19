// src/routes/tasks.js
import express from 'express';
const router = express.Router();
import { authenticateToken } from '../middleware/auth.js';
import pool from'../config/db.js';

router.get('/my', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, status FROM tasks WHERE assigned_to = ?',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error cargando tareas', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

export default router;
