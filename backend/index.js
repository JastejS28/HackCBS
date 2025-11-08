import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import connectDB from './config/database.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import dataSourceRoutes from './routes/dataSource.routes.js';
import analysisRoutes from './routes/analysis.routes.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGINS?.split(',') || 'http://localhost:5173',
    credentials: true
}));

// Body parsing middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files
app.use(express.static('public'));

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/datasource', dataSourceRoutes);
app.use('/api/v1/analysis', analysisRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Connect to database and start server
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(` Server running on http://localhost:${PORT}`);
            console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(` MongoDB Connected`);
        });
    })
    .catch((err) => {
        console.error('Failed to start server:', err);
        process.exit(1);
    });

export default app;
