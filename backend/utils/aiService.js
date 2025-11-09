// import axios from 'axios';

// const BASE_API_URL = process.env.EXTERNAL_API_BASE_URL || 'https://db-agent-api-service-698063521469.asia-south1.run.app';
// const UPLOAD_DB_URL = `${BASE_API_URL}/upload_db`;
// const GENERATE_3D_URL = `${BASE_API_URL}/3d_generate`;
// const CHAT_URL = `${BASE_API_URL}/chat`;

// // Send data to external API for upload and analysis
// export const analyzeDataWithExternalAPI = async (dataSource) => {
//     try {
//         let sourceValue;
        
//         if (dataSource.type === 'database') {
//             sourceValue = dataSource.dbConfig.connectionString;
//         } else {
//             sourceValue = dataSource.fileConfig.filePath;
//         }

//         console.log('='.repeat(80));
//         console.log('EXTERNAL API CALL - UPLOAD');
//         console.log('Type:', dataSource.type);
//         console.log('Source:', sourceValue);
//         console.log('='.repeat(80));

//         // Step 1: Upload database/file
//         const uploadPayload = { source: sourceValue };
        
//         const uploadResponse = await axios.post(UPLOAD_DB_URL, uploadPayload, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Accept': 'application/json'
//             },
//             timeout: 120000
//         });

//         console.log('✓ Upload successful');
//         console.log('Response:', JSON.stringify(uploadResponse.data, null, 2));

//         // Step 2: Generate 3D visualization
//         console.log('='.repeat(80));
//         console.log('EXTERNAL API CALL - 3D GENERATION');
//         console.log('Source:', sourceValue);
//         console.log('='.repeat(80));

//         const generate3DPayload = { source: sourceValue };

//         const visualizationResponse = await axios.post(GENERATE_3D_URL, generate3DPayload, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Accept': 'application/json'
//             },
//             timeout: 120000
//         });

//         console.log('✓ 3D Generation successful');
//         console.log('Response:', JSON.stringify(visualizationResponse.data, null, 2));

//         // Parse the 3D response to extract schema
//         const raw3DData = visualizationResponse.data;
//         let schemaData = { nodes: [], links: [] };
        
//         // Check if the response has schema data in different possible formats
//         if (raw3DData.schema) {
//             // Format 1: Wrapped in schema object
//             schemaData = raw3DData.schema;
//         } else if (raw3DData.nodes) {
//             // Format 2: Direct nodes at root level
//             // Process nodes - ensure they have proper structure
//             schemaData.nodes = raw3DData.nodes.map(node => ({
//                 id: node.id,
//                 name: node.name || node.id.replace('table_', ''),
//                 type: node.type || 'table',
//                 attributes: node.attributes || []
//             }));
            
//             // Check for links/edges/relationships
//             if (raw3DData.links) {
//                 schemaData.links = raw3DData.links;
//             } else if (raw3DData.edges) {
//                 // Convert edges to links format
//                 schemaData.links = raw3DData.edges.map(edge => ({
//                     source: edge.source,
//                     target: edge.target,
//                     relationship: edge.label || 'N:1',
//                     label: edge.join ? Object.keys(edge.join)[0] : edge.id
//                 }));
//             } else if (raw3DData.relationships) {
//                 schemaData.links = raw3DData.relationships;
//             } else {
//                 schemaData.links = [];
//             }
//         } else if (raw3DData.graph) {
//             // Format 3: Wrapped in graph object
//             schemaData = raw3DData.graph;
//         }
        
//         console.log('Parsed schema:', JSON.stringify(schemaData, null, 2));
//         console.log('Schema nodes count:', schemaData.nodes?.length || 0);
//         console.log('Schema links count:', schemaData.links?.length || 0);

//         // Return combined results
//         return {
//             summary: uploadResponse.data?.summary || uploadResponse.data?.message || 'Analysis completed successfully',
//             keyInsights: uploadResponse.data?.insights || uploadResponse.data?.key_insights || [],
//             visualizations: [],
//             rawUploadData: uploadResponse.data,
//             raw3DData: {
//                 schema: schemaData,
//                 imageUrl: raw3DData?.imageUrl || raw3DData?.image_url || raw3DData?.visualization_url || '',
//                 ...raw3DData
//             }
//         };

//     } catch (error) {
//         console.error('='.repeat(80));
//         console.error('EXTERNAL API ERROR');
//         console.error('='.repeat(80));
//         console.error('Error message:', error.message);
        
//         if (error.response) {
//             console.error('Status:', error.response.status);
//             console.error('Status text:', error.response.statusText);
//             console.error('Response data:', JSON.stringify(error.response.data, null, 2));
//             console.error('Request URL:', error.config?.url);
//             console.error('Request data:', error.config?.data);
//         } else if (error.request) {
//             console.error('No response received');
//             console.error('Request:', error.request);
//         }
//         console.error('='.repeat(80));
        
//         // Throw more detailed error
//         const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message;
//         throw new Error(`External API Error: ${errorMessage}`);
//     }
// };

// // Generate AI response for chat using external API (returns markdown)
// export const generateAIResponse = async (messages, dataSource) => {
//     try {
//         // Format messages array for the chat API
//         const chatPayload = {
//             messages: messages.map(msg => ({
//                 type: msg.role === 'user' ? 'user' : 'assistant',
//                 content: msg.content
//             }))
//         };

//         const response = await axios.post(CHAT_URL, chatPayload, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'accept': 'application/json'
//             },
//             timeout: 30000
//         });

//         console.log('Chat response:', response.data);

//         // Return markdown content from chat API
//         return {
//             content: response.data?.response || response.data?.content || '',
//             isMarkdown: true,
//             rawData: response.data
//         };

//     } catch (error) {
//         console.error('Chat API error:', error.message);
//         if (error.response) {
//             console.error('Response data:', error.response.data);
//         }
//         throw new Error('Failed to get chat response: ' + error.message);
//     }
// };

// // Placeholder function - no longer using OpenAI
// export const generateInsights = async (data) => {
//     // This function is deprecated - use analyzeDataWithExternalAPI instead
//     console.warn('generateInsights is deprecated. Use analyzeDataWithExternalAPI instead.');
//     return {
//         summary: 'Analysis in progress...',
//         keyInsights: [],
//         visualizations: []
//     };
// };







// import axios from 'axios';

// const BASE_API_URL = process.env.EXTERNAL_API_BASE_URL || 'https://db-agent-api-service-698063521469.asia-south1.run.app';
// const UPLOAD_DB_URL = `${BASE_API_URL}/upload_db`;
// const GENERATE_3D_URL = `${BASE_API_URL}/3d_generate`;
// const CHAT_URL = `${BASE_API_URL}/chat`;

// // Send data to external API for upload and analysis
// export const analyzeDataWithExternalAPI = async (dataSource) => {
//     try {
//         let sourceValue;
        
//         if (dataSource.type === 'database') {
//             sourceValue = dataSource.dbConfig.connectionString;
//         } else {
//             sourceValue = dataSource.fileConfig.filePath;
//         }

//         console.log('='.repeat(80));
//         console.log('EXTERNAL API CALL - UPLOAD');
//         console.log('Type:', dataSource.type);
//         console.log('Source:', sourceValue);
//         console.log('='.repeat(80));

//         // Step 1: Upload database/file
//         const uploadPayload = { source: sourceValue };
        
//         const uploadResponse = await axios.post(UPLOAD_DB_URL, uploadPayload, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Accept': 'application/json'
//             },
//             timeout: 120000
//         });

//         console.log('✓ Upload successful');
//         console.log('Response:', JSON.stringify(uploadResponse.data, null, 2));

//         // Step 2: Generate 3D visualization
//         console.log('='.repeat(80));
//         console.log('EXTERNAL API CALL - 3D GENERATION');
//         console.log('Source:', sourceValue);
//         console.log('='.repeat(80));

//         const generate3DPayload = { source: sourceValue };

//         const visualizationResponse = await axios.post(GENERATE_3D_URL, generate3DPayload, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Accept': 'application/json'
//             },
//             timeout: 120000
//         });

//         console.log('✓ 3D Generation successful');
//         console.log('3D Generation response:', JSON.stringify(visualizationResponse.data, null, 2));

//         // Parse the 3D response to extract schema
//         const raw3DData = visualizationResponse.data;
//         let schemaData = { nodes: [], links: [] };
        
//         // Check if the response has schema data in different possible formats
//         if (raw3DData.schema) {
//             // Format 1: Wrapped in schema object
//             schemaData = raw3DData.schema;
//         } else if (raw3DData.nodes) {
//             // Format 2: Direct nodes at root level
//             // Process nodes - ensure they have proper structure
//             schemaData.nodes = raw3DData.nodes.map(node => ({
//                 id: node.id,
//                 name: node.name || node.id.replace('table_', ''),
//                 type: node.type || 'table',
//                 attributes: node.attributes || []
//             }));
            
//             // Check for links/edges/relationships
//             if (raw3DData.links) {
//                 schemaData.links = raw3DData.links;
//             } else if (raw3DData.edges) {
//                 // Convert edges to links format
//                 schemaData.links = raw3DData.edges.map(edge => ({
//                     source: edge.source,
//                     target: edge.target,
//                     relationship: edge.label || 'N:1',
//                     label: edge.join ? Object.keys(edge.join)[0] : edge.id
//                 }));
//             } else if (raw3DData.relationships) {
//                 schemaData.links = raw3DData.relationships;
//             } else {
//                 schemaData.links = [];
//             }
//         } else if (raw3DData.graph) {
//             // Format 3: Wrapped in graph object
//             schemaData = raw3DData.graph;
//         }
        
//         console.log('Parsed schema - nodes:', schemaData.nodes?.length || 0);
//         console.log('Parsed schema - links:', schemaData.links?.length || 0);

        // Extract image URL from various possible locations
//         const imageUrl = raw3DData?.imageUrl || 
//                         raw3DData?.image_url || 
//                         raw3DData?.visualization_url || 
//                         raw3DData?.image || 
//                         '';

//         console.log('📸 3D Image URL:', imageUrl || 'No image URL found');

//         // Return combined results
//         return {
//             summary: uploadResponse.data?.summary || uploadResponse.data?.message || 'Analysis completed successfully',
//             keyInsights: uploadResponse.data?.insights || uploadResponse.data?.key_insights || [],
//             visualizations: [],
//             rawUploadData: uploadResponse.data,
//             raw3DData: {
//                 schema: schemaData,
//                 imageUrl: imageUrl,
//                 ...raw3DData
//             }
//         };

//     } catch (error) {
//         console.error('='.repeat(80));
//         console.error('EXTERNAL API ERROR');
//         console.error('='.repeat(80));
//         console.error('Error message:', error.message);
        
//         if (error.response) {
//             console.error('Status:', error.response.status);
//             console.error('Status text:', error.response.statusText);
//             console.error('Response data:', JSON.stringify(error.response.data, null, 2));
//             console.error('Request URL:', error.config?.url);
//             console.error('Request data:', error.config?.data);
//         } else if (error.request) {
//             console.error('No response received');
//             console.error('Request:', error.request);
//         }
//         console.error('='.repeat(80));
        
//         // Throw more detailed error
//         const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message;
//         throw new Error(`External API Error: ${errorMessage}`);
//     }
// };

// // Generate AI response for chat using external API (returns markdown + image URL)
// export const generateAIResponse = async (messages, dataSource) => {
//     try {
//         // Format messages array for the chat API
//         const chatPayload = {
//             messages: messages.map(msg => ({
//                 type: msg.role === 'user' ? 'user' : 'assistant',
//                 content: msg.content
//             }))
//         };

//         console.log('💬 Sending chat request:', JSON.stringify(chatPayload, null, 2));

//         const response = await axios.post(CHAT_URL, chatPayload, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'accept': 'application/json'
//             },
//             timeout: 30000
//         });

//         console.log('✅ Chat response received:', JSON.stringify(response.data, null, 2));

//         // Extract image URL from various possible locations
//         const imageUrl = response.data?.imageUrl || 
//                         response.data?.image_url || 
//                         response.data?.image || 
//                         response.data?.visualization_url || 
//                         '';

//         console.log('📸 Chat Image URL:', imageUrl || 'No image URL found');

//         // Return markdown content + image URL from chat API
//         return {
//             content: response.data?.response || response.data?.content || '',
//             imageUrl: imageUrl,
//             isMarkdown: true,
//             rawData: response.data
//         };

//     } catch (error) {
//         console.error('❌ Chat API error:', error.message);
//         if (error.response) {
//             console.error('Response data:', error.response.data);
//         }
//         throw new Error('Failed to get chat response: ' + error.message);
//     }
// };

// // Placeholder function - no longer using OpenAI
// export const generateInsights = async (data) => {
//     // This function is deprecated - use analyzeDataWithExternalAPI instead
//     console.warn('generateInsights is deprecated. Use analyzeDataWithExternalAPI instead.');
//     return {
//         summary: 'Analysis in progress...',
//         keyInsights: [],
//         visualizations: []
//     };
// };


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
        console.log('3D Generation response:', JSON.stringify(visualizationResponse.data, null, 2));

        // Parse the 3D response to extract schema
        const raw3DData = visualizationResponse.data;
        let schemaData = { nodes: [], links: [] };
        
        // Check if the response has schema data in different possible formats
        if (raw3DData.schema) {
            schemaData = raw3DData.schema;
        } else if (raw3DData.nodes) {
            schemaData.nodes = raw3DData.nodes.map(node => ({
                id: node.id,
                name: node.name || node.id.replace('table_', ''),
                type: node.type || 'table',
                attributes: node.attributes || []
            }));
            
            if (raw3DData.links) {
                schemaData.links = raw3DData.links;
            } else if (raw3DData.edges) {
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
            schemaData = raw3DData.graph;
        }
        
        console.log('Parsed schema - nodes:', schemaData.nodes?.length || 0);
        console.log('Parsed schema - links:', schemaData.links?.length || 0);

        const imageUrl = raw3DData?.imageUrl || 
                        raw3DData?.image_url || 
                        raw3DData?.visualization_url || 
                        raw3DData?.image || 
                        '';

        console.log('📸 3D Image URL:', imageUrl || 'No image URL found');

        return {
            summary: uploadResponse.data?.summary || uploadResponse.data?.message || 'Analysis completed successfully',
            keyInsights: uploadResponse.data?.insights || uploadResponse.data?.key_insights || [],
            visualizations: [],
            rawUploadData: uploadResponse.data,
            raw3DData: {
                schema: schemaData,
                imageUrl: imageUrl,
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
        
        const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message;
        throw new Error(`External API Error: ${errorMessage}`);
    }
};

// Generate AI response for chat using external API (returns markdown + image URL)
export const generateAIResponse = async (messages, dataSource) => {
    try {
        // STEP 1: Upload database first (required by the API)
        console.log('📤 Uploading database to external API before chat...');
        
        // Extract the connection string from dataSource object
        let sourceValue;
        if (dataSource.type === 'database') {
            sourceValue = dataSource.dbConfig.connectionString;
        } else {
            sourceValue = dataSource.fileConfig.filePath;
        }
        
        console.log('Source type:', dataSource.type);
        console.log('Source value:', sourceValue);
        
        const uploadPayload = {
            source: sourceValue
        };

        await axios.post(UPLOAD_DB_URL, uploadPayload, {
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            timeout: 60000
        });

        console.log('✅ Database uploaded successfully, proceeding with chat...');

        // STEP 2: Send chat request
        const chatPayload = {
            messages: messages
        };

        console.log('💬 Sending chat request to external API:', JSON.stringify(chatPayload, null, 2));

        const response = await axios.post(CHAT_URL, chatPayload, {
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            timeout: 60000
        });

        console.log('='.repeat(80));
        console.log('CHAT RESPONSE RECEIVED');
        console.log('Full response:', JSON.stringify(response.data, null, 2));
        console.log('='.repeat(80));

        let markdownContent = '';
        let imageUrl = '';

        // The API returns the full conversation in a messages array
        if (response.data?.messages && Array.isArray(response.data.messages)) {
            const aiMessages = response.data.messages.filter(msg => msg.type === 'ai');
            if (aiMessages.length > 0) {
                const lastAiMessage = aiMessages[aiMessages.length - 1];
                markdownContent = lastAiMessage.content || '';
                console.log('✅ Extracted AI response from messages array');
                console.log('Content preview:', markdownContent.substring(0, 200) + '...');
                console.log('Full content length:', markdownContent.length);
            }
        } else {
            markdownContent = response.data?.response || response.data?.content || '';
            console.log('⚠️ Using fallback extraction method');
        }

        // ENHANCED IMAGE EXTRACTION with multiple methods
        console.log('='.repeat(80));
        console.log('IMAGE EXTRACTION ATTEMPT');
        console.log('='.repeat(80));

        // Method 1: Extract base64 data URL from markdown ![alt](data:image/png;base64,...)
        const base64ImageRegex = /!\[.*?\]\((data:image\/[^;]+;base64,[^)]+)\)/g;
        let base64Matches = markdownContent.matchAll(base64ImageRegex);
        const base64Images = [...base64Matches].map(m => m[1]);
        
        if (base64Images.length > 0) {
            imageUrl = base64Images[0]; // Take first base64 image
            console.log('✅ Found', base64Images.length, 'base64 images in markdown');
            console.log('📸 Base64 image extracted (length:', imageUrl.length, 'chars)');
        } else {
            console.log('❌ No base64 images found, trying HTTP URLs...');
            
            // Method 2: Extract from markdown ![alt](http://url)
            const httpImageRegex = /!\[.*?\]\((https?:\/\/[^\s)]+)\)/g;
            let httpMatches = markdownContent.matchAll(httpImageRegex);
            const httpUrls = [...httpMatches].map(m => m[1]);
            
            if (httpUrls.length > 0) {
                imageUrl = httpUrls[0];
                console.log('✅ Found', httpUrls.length, 'HTTP images in markdown');
                console.log('📸 HTTP image URL:', imageUrl);
            }
        }

        // Method 3: Check response metadata for image fields
        if (!imageUrl) {
            const possibleFields = [
                'imageUrl', 'image_url', 'image', 'visualization_url',
                'chart_url', 'graph_url', 'plot_url', 'figure_url'
            ];
            
            for (const field of possibleFields) {
                if (response.data?.[field]) {
                    imageUrl = response.data[field];
                    console.log(`✅ Found image in response.data.${field}:`, imageUrl);
                    break;
                }
            }
        }

        // Method 4: Check if there's an image in the last AI message itself
        if (!imageUrl && response.data?.messages) {
            const lastAiMsg = response.data.messages.filter(m => m.type === 'ai').pop();
            if (lastAiMsg?.imageUrl || lastAiMsg?.image) {
                imageUrl = lastAiMsg.imageUrl || lastAiMsg.image;
                console.log('✅ Found image in AI message object:', imageUrl);
            }
        }

        console.log('='.repeat(80));
        console.log('FINAL EXTRACTION RESULT');
        console.log('Content length:', markdownContent.length);
        console.log('Image URL:', imageUrl || 'NULL - No image found');
        console.log('Has image:', !!imageUrl);
        console.log('='.repeat(80));

        return {
            content: markdownContent,
            imageUrl: imageUrl,
            isMarkdown: true,
            rawData: response.data
        };

    } catch (error) {
        console.error('❌ Chat API error:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', JSON.stringify(error.response.data, null, 2));
        }
        throw new Error('Failed to get chat response: ' + error.message);
    }
};

export const generateInsights = async (data) => {
    console.warn('generateInsights is deprecated. Use analyzeDataWithExternalAPI instead.');
    return {
        summary: 'Analysis in progress...',
        keyInsights: [],
        visualizations: []
    };
};