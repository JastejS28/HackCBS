# External API - Expected Request/Response Format

## Base URL
```
https://db-agent-api-service-698063521469.asia-south1.run.app
```

---

## 1. Upload Database Endpoint

### Request
```http
POST /upload_db
Content-Type: application/json
Accept: application/json
```

```json
{
  "source": "mysql://root:password@localhost:3306/mydb"
}
```

**OR for CSV files:**
```json
{
  "source": "C:\\Users\\jaste\\Downloads\\customers-100.csv"
}
```

### Response (Expected)
```json
{
  "summary": "Database contains 5 tables with 120 total records",
  "insights": [
    "Users table has 50 records",
    "Orders table shows 70% completion rate"
  ],
  "message": "Upload successful",
  "status": "success"
}
```

---

## 2. Generate 3D Schema Endpoint

### Request
```http
POST /3d_generate
Content-Type: application/json
Accept: application/json
```

```json
{
  "source": "mysql://root:password@localhost:3306/mydb"
}
```

### Response (Expected)
```json
{
  "schema": {
    "nodes": [
      {
        "id": "users",
        "name": "Users",
        "type": "table",
        "attributes": [
          {
            "name": "id",
            "type": "INTEGER",
            "isPrimaryKey": true,
            "isForeignKey": false
          },
          {
            "name": "username",
            "type": "VARCHAR(50)",
            "isPrimaryKey": false,
            "isForeignKey": false
          },
          {
            "name": "email",
            "type": "VARCHAR(100)",
            "isPrimaryKey": false,
            "isForeignKey": false
          },
          {
            "name": "created_at",
            "type": "TIMESTAMP",
            "isPrimaryKey": false,
            "isForeignKey": false
          }
        ]
      },
      {
        "id": "orders",
        "name": "Orders",
        "type": "table",
        "attributes": [
          {
            "name": "id",
            "type": "INTEGER",
            "isPrimaryKey": true,
            "isForeignKey": false
          },
          {
            "name": "user_id",
            "type": "INTEGER",
            "isPrimaryKey": false,
            "isForeignKey": true
          },
          {
            "name": "total_amount",
            "type": "DECIMAL(10,2)",
            "isPrimaryKey": false,
            "isForeignKey": false
          },
          {
            "name": "order_date",
            "type": "TIMESTAMP",
            "isPrimaryKey": false,
            "isForeignKey": false
          }
        ]
      },
      {
        "id": "products",
        "name": "Products",
        "type": "table",
        "attributes": [
          {
            "name": "id",
            "type": "INTEGER",
            "isPrimaryKey": true,
            "isForeignKey": false
          },
          {
            "name": "name",
            "type": "VARCHAR(100)",
            "isPrimaryKey": false,
            "isForeignKey": false
          },
          {
            "name": "price",
            "type": "DECIMAL(10,2)",
            "isPrimaryKey": false,
            "isForeignKey": false
          }
        ]
      }
    ],
    "links": [
      {
        "source": "orders",
        "target": "users",
        "relationship": "many-to-one",
        "label": "user_id"
      },
      {
        "source": "order_items",
        "target": "orders",
        "relationship": "many-to-one",
        "label": "order_id"
      },
      {
        "source": "order_items",
        "target": "products",
        "relationship": "many-to-one",
        "label": "product_id"
      }
    ]
  },
  "imageUrl": "https://storage.googleapis.com/your-bucket/schema-visualization-12345.png",
  "status": "success",
  "message": "3D schema generated successfully"
}
```

**Schema Object Structure:**
- **nodes**: Array of table objects
  - `id`: Unique identifier (lowercase table name)
  - `name`: Display name (capitalized)
  - `type`: Always "table"
  - `attributes`: Array of column objects
    - `name`: Column name
    - `type`: SQL data type
    - `isPrimaryKey`: Boolean
    - `isForeignKey`: Boolean

- **links**: Array of relationship objects
  - `source`: ID of the source table
  - `target`: ID of the target table
  - `relationship`: Type (e.g., "many-to-one", "one-to-many")
  - `label`: Foreign key column name

---

## 3. Chat Endpoint

### Request
```http
POST /chat
Content-Type: application/json
Accept: application/json
```

```json
{
  "messages": [
    {
      "type": "user",
      "content": "What tables are in this database?"
    },
    {
      "type": "assistant",
      "content": "## Database Structure\n\nYour database contains 5 main tables:\n\n1. **users** - User accounts\n2. **orders** - Order records\n3. **products** - Product catalog\n4. **order_items** - Order line items\n5. **categories** - Product categories"
    },
    {
      "type": "user",
      "content": "How many records are in the users table?"
    }
  ]
}
```

### Response (Expected)
```json
{
  "response": "## Users Table Statistics\n\nThe **users** table contains **50 records**.\n\n### Breakdown:\n- Active users: 42\n- Inactive users: 8\n- Average registration date: 2024-03-15\n\n### Sample Query:\n```sql\nSELECT COUNT(*) FROM users;\n```\n\nWould you like to know more about user demographics?",
  "status": "success",
  "timestamp": "2025-11-09T04:30:00Z"
}
```

**Markdown Formatting Support:**
Your response can include:
- **Headers**: `# H1`, `## H2`, `### H3`, etc.
- **Bold**: `**bold text**`
- **Italic**: `*italic text*`
- **Lists**: 
  ```markdown
  - Item 1
  - Item 2
  ```
- **Numbered Lists**:
  ```markdown
  1. First
  2. Second
  ```
- **Code Blocks**:
  ````markdown
  ```sql
  SELECT * FROM users;
  ```
  ````
- **Inline Code**: `` `code` ``
- **Tables**:
  ```markdown
  | Column | Type |
  |--------|------|
  | id | INT |
  ```
- **Links**: `[Text](https://example.com)`
- **Blockquotes**: `> Quote text`

---

## Complete Flow Example

### Step 1: User Submits Connection String
```
Frontend → Backend → External API
```

**Backend calls:**
```javascript
// 1. Upload database
POST /upload_db
{ "source": "mysql://root:pass@localhost:3306/mydb" }

// 2. Generate 3D schema
POST /3d_generate
{ "source": "mysql://root:pass@localhost:3306/mydb" }
```

### Step 2: Backend Stores Response
```javascript
{
  summary: uploadResponse.summary,
  keyInsights: uploadResponse.insights,
  visualizations: [],
  rawUploadData: uploadResponse,     // Full upload response
  raw3DData: generate3DResponse       // Full 3D response with schema + imageUrl
}
```

### Step 3: Frontend Displays
```
- Left Panel: Empty chat (ready for questions)
- Top-Right: 3D graph using raw3DData.schema
- Bottom-Right: Image using raw3DData.imageUrl
```

### Step 4: User Asks Question
```
Frontend → Backend → External API
```

**Backend calls:**
```javascript
POST /chat
{
  "messages": [
    { "type": "user", "content": "What tables exist?" }
  ]
}
```

**Backend receives:**
```json
{
  "response": "## Tables\n\n1. users\n2. orders\n..."
}
```

**Frontend renders:**
Markdown-formatted response in chat bubble

---

## Testing Your API

### Test 1: Upload Database
```bash
curl -X POST \
  'https://db-agent-api-service-698063521469.asia-south1.run.app/upload_db' \
  -H 'Content-Type: application/json' \
  -H 'accept: application/json' \
  -d '{"source": "mysql://root:password@localhost:3306/testdb"}'
```

### Test 2: Generate 3D
```bash
curl -X POST \
  'https://db-agent-api-service-698063521469.asia-south1.run.app/3d_generate' \
  -H 'Content-Type: application/json' \
  -H 'accept: application/json' \
  -d '{"source": "mysql://root:password@localhost:3306/testdb"}'
```

### Test 3: Chat
```bash
curl -X POST \
  'https://db-agent-api-service-698063521469.asia-south1.run.app/chat' \
  -H 'Content-Type: application/json' \
  -H 'accept: application/json' \
  -d '{
    "messages": [
      {"type": "user", "content": "Show me the database schema"}
    ]
  }'
```

---

## Important Notes

1. **Connection String Format**: 
   - MySQL: `mysql://user:pass@host:port/database`
   - PostgreSQL: `postgresql://user:pass@host:port/database`
   - SQLite: `sqlite:///path/to/database.db`
   - CSV: Full file path

2. **Image URL**: Must be publicly accessible (HTTP/HTTPS)

3. **Markdown**: Response is directly rendered, so use proper markdown syntax

4. **Schema Required Fields**: 
   - Each node MUST have: `id`, `name`, `type`, `attributes`
   - Each link MUST have: `source`, `target`

5. **Error Handling**: If API fails, wrap in try-catch and return error message
