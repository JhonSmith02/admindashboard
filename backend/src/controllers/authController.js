// src/controllers/authController.js
import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


const jwtSecret = process.env.JWT_SECRET;
const jwtExpires = process.env.JWT_EXPIRES_IN || '8h';

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const [rows] = await pool.query('SELECT id, name, email, role_id, avatar_color, password_hash FROM users WHERE email = ? LIMIT 1', [email]);
    const user = rows[0];
    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    // opcional: obtener nombre del role
    const [roleRows] = await pool.query('SELECT name FROM roles WHERE id = ? LIMIT 1', [user.role_id]);
    const roleName = roleRows[0] ? roleRows[0].name : 'user';

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: roleName
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpires });

    // devolver user sin password_hash
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: roleName,
      avatarColor: user.avatar_color
    };

    return res.json({ token, user: safeUser });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


