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

        console.log('='.repeat(80));
        console.log('BUILDING CHAT MESSAGES');
        console.log('Question:', question);
        console.log('Previous conversations:', analysis.conversations?.length || 0);

        // Build messages array for chat API - MUST USE 'human' and 'ai' types
        const messages = [];
        
        // Add conversation history
        if (analysis.conversations && analysis.conversations.length > 0) {
            analysis.conversations.forEach(conv => {
                messages.push({
                    type: 'human',  // Changed from 'user' to 'human'
                    content: conv.question
                });
                messages.push({
                    type: 'ai',  // Changed from 'assistant' to 'ai'
                    content: conv.answer
                });
            });
        }
        
        // Add current question
        messages.push({
            type: 'human',  // Changed from 'user' to 'human'
            content: question
        });

        console.log('Messages to send:', JSON.stringify(messages, null, 2));
        console.log('='.repeat(80));

        // Generate AI response using external chat API
        const response = await generateAIResponse(messages, analysis.dataSource);
        const answer = response.content;
        
        console.log('='.repeat(80));
        console.log('CHAT RESPONSE RECEIVED');
        console.log('Answer length:', answer?.length || 0);
        console.log('Has image URL:', !!response.imageUrl);
        if (response.imageUrl) {
            console.log('Image URL:', response.imageUrl);
        }
        console.log('='.repeat(80));

        // Add to conversation history with image URL if present
        const conversationEntry = {
            question,
            answer,
            timestamp: new Date()
        };
        
        if (response.imageUrl) {
            conversationEntry.imageUrl = response.imageUrl;
            console.log('Saving image URL to conversation:', response.imageUrl);
        }
        
        analysis.conversations.push(conversationEntry);
        await analysis.save();

        console.log('Conversation saved. Total conversations:', analysis.conversations.length);

        res.status(200).json({
            success: true,
            data: {
                question,
                answer,
                imageUrl: response.imageUrl || null,
                isMarkdown: response.isMarkdown
            }
        });
    } catch (error) {
        console.error('='.repeat(80));
        console.error('ASK QUESTION ERROR');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
        console.error('='.repeat(80));
        
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
        const { format } = req.query;

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