import express from 'express';
import { getCurrentUser, updateProfile, deleteAccount } from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get current user
router.get('/me', getCurrentUser);

// Update profile
router.put('/profile', updateProfile);

// Delete account
router.delete('/account', deleteAccount);

export default router;
