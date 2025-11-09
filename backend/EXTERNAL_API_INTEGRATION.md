# External Analysis API Integration

## Overview
This backend now uses an external API for data analysis instead of OpenAI. The external API receives data and returns analyzed insights, visualizations, and chat responses.

## Environment Variables

Add these to your `.env` file:

```bash
# External Analysis API URLs
EXTERNAL_ANALYSIS_API_URL=http://localhost:8000/api/analyze
EXTERNAL_CHAT_API_URL=http://localhost:8000/api/chat
```

## API Endpoints

### 1. Analysis Endpoint
**URL:** `POST /api/analyze`

**Request Payload for Database:**
```json
{
  "type": "database",
  "connectionString": "mysql://username:password@host:port/databasename",
  "dbType": "mysql" | "postgresql" | "mongodb"
}
```

**Request Payload for File:**
```json
{
  "type": "file",
  "fileUri": "/path/to/uploaded/file.csv",
  "fileName": "sales_data.csv",
  "fileType": "csv" | "xlsx"
}
```

**Connection String Formats:**
- MySQL: `mysql://username:password@host:port/databasename`
- PostgreSQL: `postgresql://username:password@host:port/databasename`
- MongoDB: `mongodb://username:password@host:port/databasename`

**Expected Response:**
```json
{
  "summary": "This dataset contains...",
  "keyInsights": [
    "Insight 1",
    "Insight 2",
    "Insight 3"
  ],
  "visualizations": [
    {
      "chartType": "bar" | "line" | "pie" | "scatter" | "area",
      "title": "Chart Title",
      "description": "Chart description",
      "data": [
        {"name": "Category1", "value": 100},
        ...
      ],
      "config": {
        // Chart-specific configuration
      }
    }
  ]
}
```

### 2. Chat Endpoint
**URL:** `POST /api/chat`

**Request Payload:**
```json
{
  "question": "What are the key trends in this data?",
  "analysisContext": {
    "summary": "Analysis summary text",
    "keyInsights": ["Insight 1", "Insight 2"],
    "columns": ["column1", "column2"]
  }
}
```

**Expected Response:**
```json
{
  "answer": "Based on the analysis, the key trends are..."
}
```

## How It Works

### Data Submission Flow:

1. **User submits database connection or file**
   - Frontend → Backend `/api/v1/datasources/database` or `/api/v1/datasources/file`

2. **Backend creates DataSource and Analysis records**
   - Status: `processing`

3. **Backend sends ONLY connection string or file URI to external API**
   - **For Database:** Sends connection string (e.g., `mysql://user:pass@host:port/db`)
   - **For File:** Sends file URI/path (e.g., `/uploads/file123.csv`)
   - **No data extraction on backend** - External API handles everything
   - External API URL: `EXTERNAL_ANALYSIS_API_URL`

4. **External API performs all data processing and analysis**
   - Connects to database using connection string OR reads file from URI
   - Extracts data, performs analysis
   - Returns: Summary, insights, visualizations

5. **Backend updates Analysis record**
   - Status: `completed`
   - Stores summary, keyInsights, visualizations

6. **Frontend polls or retrieves completed analysis**
   - Displays results to user

### Chat Flow:

1. **User asks a question**
   - Frontend → Backend `/api/v1/analysis/:id/ask`

2. **Backend sends question + context to external API**
   - External API URL: `EXTERNAL_CHAT_API_URL`

3. **External API returns answer**

4. **Backend stores conversation**
   - Adds to `analysis.conversations` array

5. **Frontend displays answer**

## Implementation Notes

- **Database Connection Strings:** Automatically built from dbConfig (host, port, username, password, databaseName)
- **File URIs:** Absolute path to uploaded file on the server
- **No Local Data Processing:** Backend does NOT extract or process data - only sends connection string/URI
- **External API Responsibility:** External API connects to DB or reads file and performs all analysis
- **Timeouts:** Analysis endpoint has 60s timeout, Chat has 30s timeout
- **Error Handling:** If external API fails, Analysis status is set to `failed`
- **No OpenAI:** OpenAI package has been removed from dependencies
- **Axios:** Used for HTTP requests to external API
- **Security Note:** Connection strings contain credentials - ensure external API is secured

## Data Flow Summary

```
Database Submission:
User Input → Backend validates → Creates DataSource
→ Builds connection string (mysql://user:pass@host:port/db)
→ Sends ONLY connection string to External API
→ External API connects to DB, extracts data, analyzes
→ Returns insights → Backend stores in DB

File Submission:
User uploads file → Multer saves to /uploads → Creates DataSource
→ Sends ONLY file URI (/uploads/file123.csv) to External API
→ External API reads file, extracts data, analyzes
→ Returns insights → Backend stores in DB
```

## Testing

You can test the integration by:

1. Starting your external API server on `http://localhost:8000`
2. Submitting a database connection or file upload
3. Checking if the analysis completes successfully
4. Asking questions in the chat interface

## Migration from OpenAI

**What was removed:**
- `openai` npm package
- OpenAI API key from `.env`
- Direct OpenAI API calls in `aiService.js`

**What was added:**
- `axios` npm package
- External API URLs in `.env`
- New functions in `aiService.js`:
  - `analyzeDataWithExternalAPI()`
  - Updated `generateAIResponse()` to use external chat API
