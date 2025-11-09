// Test script to verify external API connection
import axios from 'axios';

const BASE_API_URL = 'https://db-agent-api-service-698063521469.asia-south1.run.app';

async function testUploadDB() {
    console.log('Testing /upload_db endpoint...\n');
    
    // Test with a sample connection string (like in Swagger)
    const payload = {
        source: "C:\\Users\\jaste\\Downloads\\customers-100.csv"
    };
    
    console.log('Payload:', JSON.stringify(payload, null, 2));
    
    try {
        const response = await axios.post(`${BASE_API_URL}/upload_db`, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        console.log('✅ Success!');
        console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('❌ Error!');
        console.error('Status:', error.response?.status);
        console.error('Data:', JSON.stringify(error.response?.data, null, 2));
    }
}

async function test3DGenerate() {
    console.log('\n\nTesting /3d_generate endpoint...\n');
    
    const payload = {
        source: "C:\\Users\\jaste\\Downloads\\customers-100.csv"
    };
    
    console.log('Payload:', JSON.stringify(payload, null, 2));
    
    try {
        const response = await axios.post(`${BASE_API_URL}/3d_generate`, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        console.log('✅ Success!');
        console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('❌ Error!');
        console.error('Status:', error.response?.status);
        console.error('Data:', JSON.stringify(error.response?.data, null, 2));
    }
}

// Run tests
testUploadDB();
// Uncomment to test 3D endpoint
// test3DGenerate();
