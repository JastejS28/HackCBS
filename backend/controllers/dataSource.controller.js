import DataSource from '../models/dataSource.model.js';
import Analysis from '../models/analysis.model.js';
import { processFileUpload, validateDatabaseConnection, extractDataFromDB, extractDataFromFile } from '../utils/dataProcessor.js';

// Submit database connection
export const submitDatabaseConnection = async (req, res) => {
    try {
        const { name, dbType, host, port, username, password, databaseName } = req.body;

        // Validate required fields
        if (!name || !dbType || !host || !username || !databaseName) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Validate connection (async - returns connection status)
        const isValid = await validateDatabaseConnection({
            dbType,
            host,
            port: port || (dbType === 'mysql' ? 3306 : dbType === 'postgresql' ? 5432 : 27017),
            username,
            password,
            databaseName
        });

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Unable to connect to database. Please check your credentials.'
            });
        }

        // Create data source
        const dataSource = await DataSource.create({
            user: req.user._id,
            name,
            type: 'database',
            dbConfig: {
                dbType,
                host,
                port: port || (dbType === 'mysql' ? 3306 : dbType === 'postgresql' ? 5432 : 27017),
                username,
                password, // TODO: Encrypt in production
                databaseName
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
        const dataSource = await DataSource.findById(dataSourceId);
        const analysis = await Analysis.findById(analysisId);

        if (!dataSource || !analysis) return;

        // Extract data based on type
        let extractedData;
        if (dataSource.type === 'database') {
            extractedData = await extractDataFromDB(dataSource.dbConfig);
        } else {
            extractedData = await extractDataFromFile(dataSource.fileConfig);
        }

        // Update data source metadata
        dataSource.metadata = {
            rowCount: extractedData.rowCount,
            columnCount: extractedData.columnCount,
            columns: extractedData.columns,
            sampleData: extractedData.sampleData
        };
        dataSource.status = 'completed';
        await dataSource.save();

        // Generate AI insights (placeholder - implement with OpenAI)
        const insights = await generateInsights(extractedData);

        // Update analysis
        analysis.summary = insights.summary;
        analysis.keyInsights = insights.keyInsights;
        analysis.visualizations = insights.visualizations;
        analysis.status = 'completed';
        analysis.processingTime = Date.now() - analysis.createdAt;
        await analysis.save();

    } catch (error) {
        console.error('Processing error:', error);
        
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
