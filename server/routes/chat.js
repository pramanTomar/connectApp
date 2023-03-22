import express from 'express';
import { getUserChats } from '../controllers/chat.js';
import { verifyToken } from '../middleware/auth.js';
const router = express.Router();

router.get('/:userId', verifyToken , getUserChats);

export default router;