# Analysis Page - New 3-Panel Layout

## Overview
The Analysis page has been redesigned with a modern 3-panel layout to match your wireframe and integrate with your external API.

## Layout Structure

### 1. **Left Panel - Chat Interface** (33% width)
- **Top Section**: Header with title "Chat Interface"
- **Middle Section**: Scrollable chat messages
  - User questions displayed on the right (blue bubbles)
  - AI responses on the left (gray bubbles)
  - **Markdown Support**: AI responses are rendered using `react-markdown` with full markdown formatting support
- **Bottom Section**: Message input with send button

### 2. **Top Right Panel - 3D Database Schema** (67% width, 66% height)
- **Interactive 3D Visualization** using `react-force-graph-3d`
- Features:
  - 3D boxes representing database tables
  - Blue lines showing relationships between tables
  - Click & drag to rotate the view
  - Scroll to zoom in/out
  - Click on nodes to see table details (attributes, primary keys, foreign keys)
- **Info Overlay**: Shows table/relationship count and controls
- **Detail Popup**: Displays table attributes when a node is clicked

### 3. **Bottom Right Panel - Generated Image** (67% width, 33% height)
- Displays the image/visualization returned from your external API
- Scales to fit the container
- Shows placeholder text if no image is available

## External API Integration

### API Endpoints Used:

#### 1. `/upload_db` - Upload Database Connection
```javascript
POST https://db-agent-api-service-698063521469.asia-south1.run.app/upload_db
Content-Type: application/json

{
  "source": "mysql://user:pass@host:port/database"
}
```

#### 2. `/3d_generate` - Generate 3D Schema
```javascript
POST https://db-agent-api-service-698063521469.asia-south1.run.app/3d_generate
Content-Type: application/json

{
  "source": "mysql://user:pass@host:port/database"
}
```

**Expected Response:**
```json
{
  "schema": {
    "nodes": [
      {
        "id": "users",
        "name": "Users",
        "type": "table",
        "attributes": [
          { "name": "id", "type": "INTEGER", "isPrimaryKey": true },
          { "name": "username", "type": "VARCHAR(50)" }
        ]
      }
    ],
    "links": [
      { "source": "orders", "target": "users", "relationship": "many-to-one" }
    ]
  },
  "imageUrl": "https://your-cdn.com/visualization.png"
}
```

#### 3. `/chat` - Chat with Markdown Support
```javascript
POST https://db-agent-api-service-698063521469.asia-south1.run.app/chat
Content-Type: application/json

{
  "messages": [
    { "type": "user", "content": "What tables are in this database?" },
    { "type": "assistant", "content": "Previous response..." }
  ]
}
```

**Expected Response:**
```json
{
  "response": "## Database Tables\n\nYour database contains:\n\n1. **users** - User information\n2. **orders** - Order data\n..."
}
```

## Data Flow

### 1. **Initial Analysis**:
```
User submits connection string
  ↓
Backend calls `/upload_db` with connection string
  ↓
Backend calls `/3d_generate` with connection string
  ↓
Response stored in Analysis document:
  - raw3DData: { schema, imageUrl }
  - rawUploadData: { summary, insights }
  ↓
Frontend receives data and renders:
  - 3D schema in top-right panel
  - Image in bottom-right panel
```

### 2. **Chat Interaction**:
```
User asks question
  ↓
Backend sends message history to `/chat`
  ↓
Receives markdown-formatted response
  ↓
Frontend renders markdown in chat bubble
```

## Code Changes

### Frontend Changes:
1. **Analysis.jsx** - Complete rewrite:
   - Added `react-force-graph-3d` for 3D visualization
   - Added `react-markdown` for markdown rendering
   - Implemented 3-panel layout
   - Added 3D graph controls and interactions
   - Added image display from external API

2. **AnalysisNew.css** - Markdown styling:
   - Styles for headings, lists, code blocks
   - Table formatting
   - Link colors

### Backend Changes:
1. **aiService.js**:
   - `analyzeDataWithExternalAPI()` - Calls both `/upload_db` and `/3d_generate`
   - `generateAIResponse()` - Calls `/chat` with message history
   - Returns markdown-formatted responses

2. **Environment Variables** (`.env`):
```
EXTERNAL_API_BASE_URL=https://db-agent-api-service-698063521469.asia-south1.run.app
```

## Features

### 3D Schema Features:
- ✅ Interactive 3D rotation and zoom
- ✅ Color-coded nodes
- ✅ Animated particles along relationship links
- ✅ Click to view table details
- ✅ Attribute display with PK/FK badges

### Chat Features:
- ✅ Full markdown support (headings, lists, code, tables)
- ✅ Scrollable message history
- ✅ User/AI avatar icons
- ✅ Auto-scroll to latest message
- ✅ Message timestamps

### Image Display:
- ✅ Responsive image scaling
- ✅ Fallback for missing images
- ✅ Supports external URLs

## Testing

1. **Start servers**:
   ```bash
   # MongoDB (should already be running)
   # Backend: http://localhost:5000
   # Frontend: http://localhost:5173
   ```

2. **Submit a connection string** from the Home page

3. **View results**:
   - Left: Ask questions in chat
   - Top-right: Explore 3D schema
   - Bottom-right: See generated visualization

## Next Steps

### Your External API Should Return:

1. **For `/3d_generate`**:
```json
{
  "schema": {
    "nodes": [...],  // Array of table objects
    "links": [...]   // Array of relationship objects
  },
  "imageUrl": "https://..."  // URL to visualization image
}
```

2. **For `/chat`**:
```json
{
  "response": "# Markdown formatted response\n\n- Point 1\n- Point 2"
}
```

## Color Scheme

- **Background**: Dark gray (#111827, #1f2937, #374151)
- **Panels**: Gray-800 (#1f2937)
- **Accent**: Blue (#3b82f6, #60a5fa)
- **Text**: White/Gray gradients
- **3D Objects**: Dark slate with blue edges

## Dependencies Added

```json
{
  "react-force-graph-3d": "^1.x.x",
  "three": "^0.x.x",
  "react-markdown": "^9.x.x",
  "remark-gfm": "^4.x.x"
}
```

All dependencies are installed and servers are running successfully!
