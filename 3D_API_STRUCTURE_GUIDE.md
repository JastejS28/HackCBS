# External API 3D Schema Structure - REQUIRED FORMAT

## Problem Identified
The `/3d_generate` endpoint is not returning the correct structure for the 3D visualization.

## Required Response Format

Your `/3d_generate` endpoint MUST return this exact structure:

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
      }
    ]
  },
  "imageUrl": "https://your-storage.com/visualization.png"
}
```

## Critical Requirements

### 1. Schema Object Structure
```javascript
{
  "schema": {           // ← MUST be wrapped in "schema" object
    "nodes": [...],     // ← Array of table objects
    "links": [...]      // ← Array of relationship objects
  }
}
```

### 2. Node Structure
Each node MUST have:
- `id`: string (lowercase table name, used for linking)
- `name`: string (display name, can be capitalized)
- `type`: string (always "table")
- `attributes`: array of column objects

### 3. Attribute Structure
Each attribute MUST have:
- `name`: string (column name)
- `type`: string (SQL data type)
- `isPrimaryKey`: boolean
- `isForeignKey`: boolean

### 4. Link Structure
Each link MUST have:
- `source`: string (id of source table)
- `target`: string (id of target table)
- `relationship`: string (optional: "many-to-one", "one-to-many", etc.)
- `label`: string (optional: foreign key column name)

## Common Mistakes to Avoid

❌ **WRONG** - Schema at root level:
```json
{
  "nodes": [...],
  "links": [...]
}
```

✅ **CORRECT** - Schema wrapped in "schema" object:
```json
{
  "schema": {
    "nodes": [...],
    "links": [...]
  }
}
```

❌ **WRONG** - Using different field names:
```json
{
  "tables": [...],
  "relationships": [...]
}
```

✅ **CORRECT** - Use exact field names:
```json
{
  "nodes": [...],
  "links": [...]
}
```

## Alternative Response Formats (Also Supported)

Our backend also checks for these alternative formats:

### Format 1: Direct nodes/links at root
```json
{
  "nodes": [...],
  "links": [...],
  "imageUrl": "..."
}
```

### Format 2: Graph wrapper
```json
{
  "graph": {
    "nodes": [...],
    "links": [...]
  },
  "imageUrl": "..."
}
```

### Format 3: Preferred schema wrapper
```json
{
  "schema": {
    "nodes": [...],
    "links": [...]
  },
  "imageUrl": "..."
}
```

## Testing Your Response

### Test with cURL:
```bash
curl -X POST \
  'https://db-agent-api-service-698063521469.asia-south1.run.app/3d_generate' \
  -H 'Content-Type: application/json' \
  -H 'accept: application/json' \
  -d '{
    "source": "mysql://root:password@localhost:3306/testdb"
  }'
```

### Expected Console Output:
When the backend receives your response, you should see:
```
================================================================================
EXTERNAL API CALL - 3D GENERATION
Source: mysql://root:password@localhost:3306/testdb
================================================================================
✓ 3D Generation successful
Response: {
  "schema": {
    "nodes": [...],
    "links": [...]
  },
  "imageUrl": "https://..."
}
Parsed schema: {
  "nodes": [...],
  "links": [...]
}
Schema nodes count: 5
Schema links count: 4
```

## Full Example for a Simple E-commerce Database

```json
{
  "schema": {
    "nodes": [
      {
        "id": "users",
        "name": "Users",
        "type": "table",
        "attributes": [
          { "name": "id", "type": "INTEGER", "isPrimaryKey": true, "isForeignKey": false },
          { "name": "username", "type": "VARCHAR(50)", "isPrimaryKey": false, "isForeignKey": false },
          { "name": "email", "type": "VARCHAR(100)", "isPrimaryKey": false, "isForeignKey": false },
          { "name": "created_at", "type": "TIMESTAMP", "isPrimaryKey": false, "isForeignKey": false }
        ]
      },
      {
        "id": "orders",
        "name": "Orders",
        "type": "table",
        "attributes": [
          { "name": "id", "type": "INTEGER", "isPrimaryKey": true, "isForeignKey": false },
          { "name": "user_id", "type": "INTEGER", "isPrimaryKey": false, "isForeignKey": true },
          { "name": "total_amount", "type": "DECIMAL(10,2)", "isPrimaryKey": false, "isForeignKey": false },
          { "name": "status", "type": "VARCHAR(20)", "isPrimaryKey": false, "isForeignKey": false },
          { "name": "order_date", "type": "TIMESTAMP", "isPrimaryKey": false, "isForeignKey": false }
        ]
      },
      {
        "id": "products",
        "name": "Products",
        "type": "table",
        "attributes": [
          { "name": "id", "type": "INTEGER", "isPrimaryKey": true, "isForeignKey": false },
          { "name": "name", "type": "VARCHAR(100)", "isPrimaryKey": false, "isForeignKey": false },
          { "name": "price", "type": "DECIMAL(10,2)", "isPrimaryKey": false, "isForeignKey": false },
          { "name": "stock", "type": "INTEGER", "isPrimaryKey": false, "isForeignKey": false }
        ]
      },
      {
        "id": "order_items",
        "name": "Order Items",
        "type": "table",
        "attributes": [
          { "name": "id", "type": "INTEGER", "isPrimaryKey": true, "isForeignKey": false },
          { "name": "order_id", "type": "INTEGER", "isPrimaryKey": false, "isForeignKey": true },
          { "name": "product_id", "type": "INTEGER", "isPrimaryKey": false, "isForeignKey": true },
          { "name": "quantity", "type": "INTEGER", "isPrimaryKey": false, "isForeignKey": false },
          { "name": "price", "type": "DECIMAL(10,2)", "isPrimaryKey": false, "isForeignKey": false }
        ]
      },
      {
        "id": "categories",
        "name": "Categories",
        "type": "table",
        "attributes": [
          { "name": "id", "type": "INTEGER", "isPrimaryKey": true, "isForeignKey": false },
          { "name": "name", "type": "VARCHAR(50)", "isPrimaryKey": false, "isForeignKey": false },
          { "name": "description", "type": "TEXT", "isPrimaryKey": false, "isForeignKey": false }
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
      },
      {
        "source": "products",
        "target": "categories",
        "relationship": "many-to-one",
        "label": "category_id"
      }
    ]
  },
  "imageUrl": "https://storage.googleapis.com/your-bucket/schema-viz-12345.png",
  "message": "3D schema generated successfully",
  "timestamp": "2025-11-09T05:45:00Z"
}
```

## What Happens in Frontend

The 3D visualization (react-force-graph-3d) uses this data to:
1. Create 3D boxes for each node (table)
2. Draw blue animated lines between nodes (relationships)
3. Show table names on the boxes
4. Display attributes when you click a node
5. Highlight primary keys (PK) and foreign keys (FK) with badges

## Debugging Checklist

If the 3D visualization doesn't show:

1. ✅ Check backend console for "Schema nodes count" - should be > 0
2. ✅ Check frontend console for "Setting graph data"
3. ✅ Verify response has `schema` wrapper
4. ✅ Verify `nodes` is an array with at least one element
5. ✅ Verify each node has `id`, `name`, `type`, `attributes`
6. ✅ Verify `links` is an array (can be empty for single table)
7. ✅ Check that `source` and `target` in links match node `id` values

## Image URL Format

The `imageUrl` field should be:
- A publicly accessible HTTP/HTTPS URL
- PNG, JPG, or SVG format
- Recommended size: 800x600 or larger
- Should be a direct link to the image file

Example valid URLs:
- `https://storage.googleapis.com/bucket/image.png`
- `https://your-cdn.com/visualizations/db-schema.jpg`
- `https://api.yourservice.com/images/schema-123.png`

❌ Invalid:
- Local file paths: `C:\\Users\\...\\image.png`
- Relative paths: `/images/schema.png`
- URLs without protocol: `www.example.com/image.png`
