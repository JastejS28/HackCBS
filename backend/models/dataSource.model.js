import mongoose from 'mongoose';

const dataSourceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['database', 'file'],
        required: true
    },
    // For database connections
    dbConfig: {
        dbType: {
            type: String,
            enum: ['mysql', 'postgresql', 'mongodb']
        },
        host: String,
        port: Number,
        username: String,
        password: String, // In production, encrypt this
        databaseName: String
    },
    // For file uploads
    fileConfig: {
        fileName: String,
        fileType: {
            type: String,
            enum: ['csv', 'xlsx']
        },
        filePath: String,
        fileSize: Number,
        uploadDate: Date
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending'
    },
    metadata: {
        rowCount: Number,
        columnCount: Number,
        columns: [String],
        sampleData: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true
});

const DataSource = mongoose.model('DataSource', dataSourceSchema);

export default DataSource;
