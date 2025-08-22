// src/controllers/usersController.js
import pool from '../config/db.js';
import bcrypt from 'bcrypt';

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

/**
 * POST /api/users
 * Solo admin: crear nuevo usuario
 */
export async function createUser(req, res) {
  try {
    const { name, email, role, password, status = 'Activo', avatar_color } = req.body;

    // Validaciones básicas
    if (!name || !email || !role) {
      return res.status(400).json({ error: 'Name, email and role are required' });
    }

    // Validar email único
    const [existingUser] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Obtener role_id
    const [roleRows] = await pool.query('SELECT id FROM roles WHERE name = ?', [role]);
    let roleId = null;
    
    if (roleRows.length === 0) {
      // Si el rol no existe, crearlo
      const [newRole] = await pool.query('INSERT INTO roles (name) VALUES (?)', [role]);
      roleId = newRole.insertId;
    } else {
      roleId = roleRows[0].id;
    }

    // Hash de la contraseña (usar una por defecto si no se proporciona)
    const defaultPassword = password || 'password123';
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(defaultPassword, saltRounds);

    // Insertar usuario
    const [result] = await pool.query(
      `INSERT INTO users (name, email, role_id, password_hash, status, avatar_color, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, email, roleId, password_hash, status, avatar_color]
    );

    // Obtener el usuario creado con el nombre del rol
    const [newUser] = await pool.query(
      `SELECT u.id, u.name, u.email, r.name AS role, u.status, u.avatar_color, u.created_at, u.updated_at
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`, [result.insertId]
    );

    return res.status(201).json(newUser[0]);
  } catch (err) {
    console.error('createUser', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * PUT /api/users/:id
 * Solo admin: actualizar usuario
 */
export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email, role, status, avatar_color } = req.body;

    // Verificar que el usuario existe
    const [existingUser] = await pool.query('SELECT id FROM users WHERE id = ?', [id]);
    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validar email único (excluyendo el usuario actual)
    if (email) {
      const [emailCheck] = await pool.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, id]);
      if (emailCheck.length > 0) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    // Obtener role_id si se proporciona rol
    let roleId = null;
    if (role) {
      const [roleRows] = await pool.query('SELECT id FROM roles WHERE name = ?', [role]);
      if (roleRows.length === 0) {
        // Crear el rol si no existe
        const [newRole] = await pool.query('INSERT INTO roles (name) VALUES (?)', [role]);
        roleId = newRole.insertId;
      } else {
        roleId = roleRows[0].id;
      }
    }

    // Construir la consulta de actualización dinámicamente
    const updateFields = [];
    const updateValues = [];

    if (name) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    if (roleId) {
      updateFields.push('role_id = ?');
      updateValues.push(roleId);
    }
    if (status) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }
    if (avatar_color) {
      updateFields.push('avatar_color = ?');
      updateValues.push(avatar_color);
    }

    updateFields.push('updated_at = NOW()');
    updateValues.push(id);

    if (updateFields.length === 1) { // Solo updated_at
      return res.status(400).json({ error: 'No fields to update' });
    }

    await pool.query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Obtener el usuario actualizado
    const [updatedUser] = await pool.query(
      `SELECT u.id, u.name, u.email, r.name AS role, u.status, u.avatar_color, u.created_at, u.updated_at
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`, [id]
    );

    return res.json(updatedUser[0]);
  } catch (err) {
    console.error('updateUser', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * DELETE /api/users/:id
 * Solo admin: eliminar usuario
 */
export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    // Verificar que el usuario existe
    const [existingUser] = await pool.query('SELECT id, name FROM users WHERE id = ?', [id]);
    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Evitar que el admin se elimine a sí mismo
    if (Number(req.user.id) === Number(id)) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    // Eliminar el usuario
    await pool.query('DELETE FROM users WHERE id = ?', [id]);

    return res.json({ 
      message: 'User deleted successfully',
      deletedUser: existingUser[0]
    });
  } catch (err) {
    console.error('deleteUser', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}