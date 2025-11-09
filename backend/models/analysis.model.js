// import mongoose from 'mongoose';

// const analysisSchema = new mongoose.Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true,
//         index: true
//     },
//     dataSource: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'DataSource',
//         required: true
//     },
//     status: {
//         type: String,
//         enum: ['pending', 'processing', 'completed', 'failed'],
//         default: 'pending'
//     },
//     // AI-generated insights
//     summary: {
//         type: String
//     },
//     keyInsights: [{
//         type: String
//     }],
//     // Chart data
//     visualizations: [{
//         chartType: {
//             type: String,
//             enum: ['bar', 'line', 'pie', 'scatter', 'area']
//         },
//         title: String,
//         description: String,
//         data: mongoose.Schema.Types.Mixed,
//         config: mongoose.Schema.Types.Mixed
//     }],
//     // RAG conversation history
//     conversations: [{
//         question: String,
//         answer: String,
//         timestamp: {
//             type: Date,
//             default: Date.now
//         }
//     }],
//     // Processing metadata
//     processingTime: Number,
//     errorMessage: String
// }, {
//     timestamps: true
// });

// const Analysis = mongoose.model('Analysis', analysisSchema);

// export default Analysis;



import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    dataSource: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DataSource',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending'
    },
    // AI-generated insights
    summary: {
        type: String
    },
    keyInsights: [{
        type: String
    }],
    // Chart data
    visualizations: [{
        chartType: {
            type: String,
            enum: ['bar', 'line', 'pie', 'scatter', 'area']
        },
        title: String,
        description: String,
        data: mongoose.Schema.Types.Mixed,
        config: mongoose.Schema.Types.Mixed
    }],
    // RAG conversation history
    conversations: [{
        question: String,
        answer: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    // Raw API responses - CRITICAL FOR 3D VISUALIZATION
    rawUploadData: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    raw3DData: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    // Processing metadata
    processingTime: Number,
    errorMessage: String
}, {
    timestamps: true
});

const Analysis = mongoose.model('Analysis', analysisSchema);

export default Analysis;