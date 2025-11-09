import axios from 'axios';

const BASE_API_URL = process.env.EXTERNAL_API_BASE_URL || 'https://db-agent-api-service-698063521469.asia-south1.run.app';
const UPLOAD_DB_URL = `${BASE_API_URL}/upload_db`;
const GENERATE_3D_URL = `${BASE_API_URL}/3d_generate`;
const CHAT_URL = `${BASE_API_URL}/chat`;

// Send data to external API for upload and analysis
export const analyzeDataWithExternalAPI = async (dataSource) => {
    try {
        let sourceValue;
        
        if (dataSource.type === 'database') {
            sourceValue = dataSource.dbConfig.connectionString;
        } else {
            sourceValue = dataSource.fileConfig.filePath;
        }

        console.log('='.repeat(80));
        console.log('EXTERNAL API CALL - UPLOAD');
        console.log('Type:', dataSource.type);
        console.log('Source:', sourceValue);
        console.log('='.repeat(80));

        // Step 1: Upload database/file
        const uploadPayload = { source: sourceValue };
        
        const uploadResponse = await axios.post(UPLOAD_DB_URL, uploadPayload, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 120000
        });

        console.log('✓ Upload successful');
        console.log('Response:', JSON.stringify(uploadResponse.data, null, 2));

        // Step 2: Generate 3D visualization
        console.log('='.repeat(80));
        console.log('EXTERNAL API CALL - 3D GENERATION');
        console.log('Source:', sourceValue);
        console.log('='.repeat(80));

        const generate3DPayload = { source: sourceValue };

        const visualizationResponse = await axios.post(GENERATE_3D_URL, generate3DPayload, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 120000
        });

        console.log('✓ 3D Generation successful');
        console.log('Response:', JSON.stringify(visualizationResponse.data, null, 2));

        // Parse the 3D response to extract schema
        const raw3DData = visualizationResponse.data;
        let schemaData = { nodes: [], links: [] };
        
        // Check if the response has schema data in different possible formats
        if (raw3DData.schema) {
            // Format 1: Wrapped in schema object
            schemaData = raw3DData.schema;
        } else if (raw3DData.nodes) {
            // Format 2: Direct nodes at root level
            // Process nodes - ensure they have proper structure
            schemaData.nodes = raw3DData.nodes.map(node => ({
                id: node.id,
                name: node.name || node.id.replace('table_', ''),
                type: node.type || 'table',
                attributes: node.attributes || []
            }));
            
            // Check for links/edges/relationships
            if (raw3DData.links) {
                schemaData.links = raw3DData.links;
            } else if (raw3DData.edges) {
                // Convert edges to links format
                schemaData.links = raw3DData.edges.map(edge => ({
                    source: edge.source,
                    target: edge.target,
                    relationship: edge.label || 'N:1',
                    label: edge.join ? Object.keys(edge.join)[0] : edge.id
                }));
            } else if (raw3DData.relationships) {
                schemaData.links = raw3DData.relationships;
            } else {
                schemaData.links = [];
            }
        } else if (raw3DData.graph) {
            // Format 3: Wrapped in graph object
            schemaData = raw3DData.graph;
        }
        
        console.log('Parsed schema:', JSON.stringify(schemaData, null, 2));
        console.log('Schema nodes count:', schemaData.nodes?.length || 0);
        console.log('Schema links count:', schemaData.links?.length || 0);

        // Return combined results
        return {
            summary: uploadResponse.data?.summary || uploadResponse.data?.message || 'Analysis completed successfully',
            keyInsights: uploadResponse.data?.insights || uploadResponse.data?.key_insights || [],
            visualizations: [],
            rawUploadData: uploadResponse.data,
            raw3DData: {
                schema: schemaData,
                imageUrl: raw3DData?.imageUrl || raw3DData?.image_url || raw3DData?.visualization_url || '',
                ...raw3DData
            }
        };

    } catch (error) {
        console.error('='.repeat(80));
        console.error('EXTERNAL API ERROR');
        console.error('='.repeat(80));
        console.error('Error message:', error.message);
        
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Status text:', error.response.statusText);
            console.error('Response data:', JSON.stringify(error.response.data, null, 2));
            console.error('Request URL:', error.config?.url);
            console.error('Request data:', error.config?.data);
        } else if (error.request) {
            console.error('No response received');
            console.error('Request:', error.request);
        }
        console.error('='.repeat(80));
        
        // Throw more detailed error
        const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message;
        throw new Error(`External API Error: ${errorMessage}`);
    }
};

// Generate AI response for chat using external API (returns markdown)
export const generateAIResponse = async (messages, dataSource) => {
    try {
        // Format messages array for the chat API
        const chatPayload = {
            messages: messages.map(msg => ({
                type: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            }))
        };

        const response = await axios.post(CHAT_URL, chatPayload, {
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            timeout: 30000
        });

        console.log('Chat response:', response.data);

        // Return markdown content from chat API
        return {
            content: response.data?.response || response.data?.content || '',
            isMarkdown: true,
            rawData: response.data
        };

    } catch (error) {
        console.error('Chat API error:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
        throw new Error('Failed to get chat response: ' + error.message);
    }
};

// Placeholder function - no longer using OpenAI
export const generateInsights = async (data) => {
    // This function is deprecated - use analyzeDataWithExternalAPI instead
    console.warn('generateInsights is deprecated. Use analyzeDataWithExternalAPI instead.');
    return {
        summary: 'Analysis in progress...',
        keyInsights: [],
        visualizations: []
    };
};
