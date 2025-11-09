import DataSource from '../models/dataSource.model.js';
import Analysis from '../models/analysis.model.js';
import { processFileUpload, validateDatabaseConnection, extractDataFromDB, extractDataFromFile } from '../utils/dataProcessor.js';
import { analyzeDataWithExternalAPI } from '../utils/aiService.js';

// Submit database connection
export const submitDatabaseConnection = async (req, res) => {
    try {
        const { name, connectionString } = req.body;

        // Validate required fields
        if (!connectionString) {
            return res.status(400).json({
                success: false,
                message: 'Connection string is required'
            });
        }

        // Parse connection string to get dbType
        let dbType = 'unknown';
        if (connectionString.startsWith('mysql://')) {
            dbType = 'mysql';
        } else if (connectionString.startsWith('postgresql://') || connectionString.startsWith('postgres://')) {
            dbType = 'postgresql';
        } else if (connectionString.startsWith('mongodb://')) {
            dbType = 'mongodb';
        }

        // Create data source with connection string
        const dataSource = await DataSource.create({
            user: req.user._id,
            name: name || 'Database Connection',
            type: 'database',
            dbConfig: {
                connectionString: connectionString,
                dbType: dbType
            },
            status: 'pending'
        });

        // Create analysis record
        const analysis = await Analysis.create({
            user: req.user._id,
            dataSource: dataSource._id,
            status: 'processing'
        });

        // Start async processing
        processDataSource(dataSource._id, analysis._id);

        res.status(201).json({
            success: true,
            message: 'Database connection submitted. Processing started.',
            data: {
                dataSourceId: dataSource._id,
                analysisId: analysis._id
            }
        });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Submit file upload
export const submitFileUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const { originalname, filename, mimetype, size, path } = req.file;
        const fileType = originalname.endsWith('.csv') ? 'csv' : 'xlsx';
        const name = req.body.name || originalname;

        // Create data source
        const dataSource = await DataSource.create({
            user: req.user._id,
            name,
            type: 'file',
            fileConfig: {
                fileName: originalname,
                fileType,
                filePath: path,
                fileSize: size,
                uploadDate: new Date()
            },
            status: 'pending'
        });

        // Create analysis record
        const analysis = await Analysis.create({
            user: req.user._id,
            dataSource: dataSource._id,
            status: 'processing'
        });

        // Start async processing
        processDataSource(dataSource._id, analysis._id);

        res.status(201).json({
            success: true,
            message: 'File uploaded. Processing started.',
            data: {
                dataSourceId: dataSource._id,
                analysisId: analysis._id
            }
        });
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all data sources for user
export const getDataSources = async (req, res) => {
    try {
        const dataSources = await DataSource.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .select('-dbConfig.password');

        res.status(200).json({
            success: true,
            count: dataSources.length,
            data: dataSources
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Async processing function
async function processDataSource(dataSourceId, analysisId) {
    try {
        console.log('='.repeat(80));
        console.log('PROCESSING DATA SOURCE');
        console.log('Data Source ID:', dataSourceId);
        console.log('Analysis ID:', analysisId);
        console.log('='.repeat(80));

        const dataSource = await DataSource.findById(dataSourceId);
        const analysis = await Analysis.findById(analysisId);

        if (!dataSource || !analysis) {
            console.error('DataSource or Analysis not found!');
            return;
        }

        console.log('Calling external API for analysis...');
        
        // Send connection string or file URI directly to external API
        // No local data extraction - external API handles everything
        const analysisResult = await analyzeDataWithExternalAPI(dataSource);

        console.log('='.repeat(80));
        console.log('ANALYSIS RESULT RECEIVED');
        console.log('Summary:', analysisResult.summary);
        console.log('Key Insights:', analysisResult.keyInsights);
        console.log('Has raw3DData:', !!analysisResult.raw3DData);
        console.log('Has rawUploadData:', !!analysisResult.rawUploadData);
        if (analysisResult.raw3DData) {
            console.log('raw3DData schema:', analysisResult.raw3DData.schema);
            console.log('raw3DData imageUrl:', analysisResult.raw3DData.imageUrl);
        }
        console.log('='.repeat(80));

        // Update data source status
        dataSource.status = 'completed';
        await dataSource.save();

        // Update analysis with results from external API
        analysis.summary = analysisResult.summary || 'Analysis completed';
        analysis.keyInsights = analysisResult.keyInsights || [];
        analysis.visualizations = analysisResult.visualizations || [];
        
        // CRITICAL: Store the raw API responses
        analysis.rawUploadData = analysisResult.rawUploadData || {};
        analysis.raw3DData = analysisResult.raw3DData || {};
        
        analysis.status = 'completed';
        analysis.processingTime = Date.now() - analysis.createdAt;
        
        await analysis.save();
        
        console.log('='.repeat(80));
        console.log('ANALYSIS SAVED TO DATABASE');
        console.log('Analysis ID:', analysis._id);
        console.log('Status:', analysis.status);
        console.log('Has raw3DData in DB:', !!analysis.raw3DData);
        console.log('='.repeat(80));

    } catch (error) {
        console.error('='.repeat(80));
        console.error('PROCESSING ERROR');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('='.repeat(80));
        
        // Update status to failed
        await DataSource.findByIdAndUpdate(dataSourceId, { status: 'failed' });
        await Analysis.findByIdAndUpdate(analysisId, { 
            status: 'failed',
            errorMessage: error.message 
        });
    }
}

// Placeholder for AI insights generation
async function generateInsights(data) {
    // TODO: Implement with OpenAI RAG
    return {
        summary: 'This is a sample analysis summary.',
        keyInsights: [
            'Key insight 1',
            'Key insight 2',
            'Key insight 3'
        ],
        visualizations: [
            {
                chartType: 'bar',
                title: 'Sample Bar Chart',
                description: 'This is a sample visualization',
                data: data.sampleData,
                config: {}
            }
        ]
    };
}
