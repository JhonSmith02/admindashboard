import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {listUsers, getMe, getUserById} from '../controllers/usersControllers.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, requireRole('admin'), listUsers);

router.get('/me', authenticateToken, getMe);

router.get('/:id', authenticateToken, getUserById);


export default router;



