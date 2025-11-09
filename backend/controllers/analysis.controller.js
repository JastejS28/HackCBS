import Analysis from '../models/analysis.model.js';
import { generateAIResponse } from '../utils/aiService.js';
import { generatePDFReport } from '../utils/reportGenerator.js';

// Get analysis by ID
export const getAnalysis = async (req, res) => {
    try {
        const { id } = req.params;

        const analysis = await Analysis.findOne({
            _id: id,
            user: req.user._id
        }).populate('dataSource', '-dbConfig.password');

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: 'Analysis not found'
            });
        }

        res.status(200).json({
            success: true,
            data: analysis
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all analyses for user
export const getAllAnalyses = async (req, res) => {
    try {
        const analyses = await Analysis.find({ user: req.user._id })
            .populate('dataSource', 'name type status')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: analyses.length,
            data: analyses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Ask follow-up question (RAG)
export const askQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({
                success: false,
                message: 'Question is required'
            });
        }

        const analysis = await Analysis.findOne({
            _id: id,
            user: req.user._id
        }).populate('dataSource');

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: 'Analysis not found'
            });
        }

        // Build messages array for chat API
        const messages = [
            // Include previous conversation history
            ...analysis.conversations.map(conv => [
                { role: 'user', content: conv.question },
                { role: 'assistant', content: conv.answer }
            ]).flat(),
            // Add current question
            { role: 'user', content: question }
        ];

        // Generate AI response using external chat API (returns markdown)
        const response = await generateAIResponse(messages, analysis.dataSource);
        const answer = response.content;

        // Add to conversation history
        analysis.conversations.push({
            question,
            answer,
            timestamp: new Date()
        });
        await analysis.save();

        res.status(200).json({
            success: true,
            data: {
                question,
                answer,
                isMarkdown: response.isMarkdown
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Export report as PDF
export const exportReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { format } = req.query; // pdf or excel

        const analysis = await Analysis.findOne({
            _id: id,
            user: req.user._id
        }).populate('dataSource');

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: 'Analysis not found'
            });
        }

        if (analysis.status !== 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Analysis is not yet completed'
            });
        }

        // Generate PDF report
        const pdfBuffer = await generatePDFReport(analysis);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=analysis-${id}.pdf`);
        res.send(pdfBuffer);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Check analysis status
export const checkStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const analysis = await Analysis.findOne({
            _id: id,
            user: req.user._id
        }).select('status processingTime errorMessage');

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: 'Analysis not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                status: analysis.status,
                processingTime: analysis.processingTime,
                errorMessage: analysis.errorMessage
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
