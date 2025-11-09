# External API Integration - Final Implementation

## Your External API Base URL
```
https://db-agent-api-service-698063521469.asia-south1.run.app
```

## API Endpoints Used

### 1. Upload Database/File - `/upload_db`
**Method:** POST  
**Purpose:** Initial upload and analysis of database connection or CSV file

**Request Format:**
```json
{
  "source": "mysql://root:password@localhost:3306/mydb"
}
```
OR
```json
{
  "source": "C:\\Users\\jaste\\Downloads\\customers-100.csv"
}
```

**Headers:**
```
Content-Type: application/json
accept: application/json
```

**Example cURL:**
```bash
curl -X 'POST' \
  'https://db-agent-api-service-698063521469.asia-south1.run.app/upload_db' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "source": "C:\\Users\\jaste\\Downloads\\customers-100.csv"
}'
```

---

### 2. Generate 3D Visualization - `/3d_generate`
**Method:** POST  
**Purpose:** Generate 3D visualizations from the data source

**Request Format:**
```json
{
  "source": "string"
}
```

**Headers:**
```
Content-Type: application/json
accept: application/json
```

**Example cURL:**
```bash
curl -X 'POST' \
  'https://db-agent-api-service-698063521469.asia-south1.run.app/3d_generate' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "source": "string"
}'
```

---

### 3. Chat Interface - `/chat`
**Method:** POST  
**Purpose:** Chat with AI about the data (returns Markdown formatted responses)

**Request Format:**
```json
{
  "messages": [
    {
      "type": "user",
      "content": "What are the key insights from this data?"
    },
    {
      "type": "assistant",
      "content": "Based on the analysis..."
    },
    {
      "type": "user",
      "content": "Tell me more about the trends"
    }
  ]
}
```

**Headers:**
```
Content-Type: application/json
accept: application/json
```

**Example cURL:**
```bash
curl -X 'POST' \
  'https://db-agent-api-service-698063521469.asia-south1.run.app/chat' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "messages": [
    {
      "type": "user",
      "content": "What are the top 5 customers by spending?"
    }
  ]
}'
```

---

## Integration Flow

### When User Submits Data Source:

1. **Frontend** sends connection string to backend:
   ```javascript
   POST /api/data-sources/database
   {
     "name": "My Database",
     "connectionString": "mysql://root:password@localhost:3306/mydb"
   }
   ```

2. **Backend** calls your `/upload_db` endpoint:
   ```javascript
   POST https://db-agent-api-service-698063521469.asia-south1.run.app/upload_db
   {
     "source": "mysql://root:password@localhost:3306/mydb"
   }
   ```

3. **Backend** calls your `/3d_generate` endpoint:
   ```javascript
   POST https://db-agent-api-service-698063521469.asia-south1.run.app/3d_generate
   {
     "source": "mysql://root:password@localhost:3306/mydb"
   }
   ```

4. **Backend** combines results and returns to frontend

---

### When User Chats:

1. **Frontend** sends question to backend:
   ```javascript
   POST /api/analyses/:id/ask
   {
     "question": "What are the sales trends?"
   }
   ```

2. **Backend** formats conversation history and calls your `/chat` endpoint:
   ```javascript
   POST https://db-agent-api-service-698063521469.asia-south1.run.app/chat
   {
     "messages": [
       {"type": "user", "content": "What are the sales trends?"}
     ]
   }
   ```

3. **Backend** receives Markdown response and sends to frontend

4. **Frontend** renders Markdown formatted response

---

## Environment Variables

Add to your `.env` file:

```env
EXTERNAL_API_BASE_URL=https://db-agent-api-service-698063521469.asia-south1.run.app
```

---

## Code Implementation

### Backend - `utils/aiService.js`
```javascript
const BASE_API_URL = process.env.EXTERNAL_API_BASE_URL || 
  'https://db-agent-api-service-698063521469.asia-south1.run.app';

const UPLOAD_DB_URL = `${BASE_API_URL}/upload_db`;
const GENERATE_3D_URL = `${BASE_API_URL}/3d_generate`;
const CHAT_URL = `${BASE_API_URL}/chat`;
```

### Analysis Flow
1. Upload → Get summary and insights
2. Generate 3D → Get visualization data
3. Chat → Get markdown responses with conversation history

---

## Testing

### Test Upload:
```bash
curl -X POST \
  https://db-agent-api-service-698063521469.asia-south1.run.app/upload_db \
  -H 'Content-Type: application/json' \
  -d '{"source": "mysql://test:test@localhost:3306/testdb"}'
```

### Test 3D Generation:
```bash
curl -X POST \
  https://db-agent-api-service-698063521469.asia-south1.run.app/3d_generate \
  -H 'Content-Type: application/json' \
  -d '{"source": "mysql://test:test@localhost:3306/testdb"}'
```

### Test Chat:
```bash
curl -X POST \
  https://db-agent-api-service-698063521469.asia-south1.run.app/chat \
  -H 'Content-Type: application/json' \
  -d '{
    "messages": [
      {"type": "user", "content": "Analyze this database"}
    ]
  }'
```

---

## Response Handling

The backend now:
- ✅ Sends only connection string or file path to your API
- ✅ Calls `/upload_db` for initial analysis
- ✅ Calls `/3d_generate` for visualizations
- ✅ Calls `/chat` with conversation history for Q&A
- ✅ Handles markdown responses from chat
- ✅ No local data extraction or processing
