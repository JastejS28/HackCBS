import express from 'express';
import { syncUser } from '../controllers/auth.controller.js';

const router = express.Router();

// Sync user after Firebase login
router.post('/sync', syncUser);

export default router;
