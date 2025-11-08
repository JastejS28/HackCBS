import express from 'express';
import { getAnalysis, getAllAnalyses, askQuestion, exportReport, checkStatus } from '../controllers/analysis.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get all analyses
router.get('/', getAllAnalyses);

// Get specific analysis
router.get('/:id', getAnalysis);

// Check analysis status
router.get('/:id/status', checkStatus);

// Ask follow-up question (RAG)
router.post('/:id/ask', askQuestion);

// Export report
router.get('/:id/export', exportReport);

export default router;
