// src/controllers/usersController.js
import pool from '../config/db.js';

/**
 * GET /api/users
 * Solo admin: lista usuarios (sin password_hash)
 */
export async function listUsers(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, r.name AS role, u.status, u.avatar_color, u.created_at, u.updated_at
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       ORDER BY u.name ASC`
    );
    return res.json(rows);
  } catch (err) {
    console.error('listUsers', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /api/users/me
 */
export async function getMe(req, res) {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, r.name AS role, u.status, u.avatar_color, u.created_at, u.updated_at
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.id = ? LIMIT 1`, [userId]
    );
    if (!rows[0]) return res.status(404).json({ error: 'User not found' });
    return res.json(rows[0]);
  } catch (err) {
    console.error('getMe', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /api/users/:id
 * Admin or self
 */
export async function getUserById(req, res) {
  try {
    const { id } = req.params;
    // si no admin y no es su propio id -> 403
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && Number(req.user.id) !== Number(id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, r.name AS role, u.status, u.avatar_color, u.created_at, u.updated_at
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.id = ? LIMIT 1`, [id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'User not found' });
    return res.json(rows[0]);
  } catch (err) {
    console.error('getUserById', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

