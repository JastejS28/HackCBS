import express from 'express';
import multer from 'multer';
import path from 'path';
import { submitDatabaseConnection, submitFileUpload, getDataSources } from '../controllers/dataSource.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['.csv', '.xlsx'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Only CSV and XLSX files are allowed'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB default
    }
});

// All routes require authentication
router.use(verifyToken);

// Submit database connection
router.post('/database', submitDatabaseConnection);

// Submit file upload
router.post('/file', upload.single('file'), submitFileUpload);

// Get all data sources
router.get('/', getDataSources);

export default router;
