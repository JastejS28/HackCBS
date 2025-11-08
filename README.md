# AI-Driven DB RAG & Analytics System

A full-stack application for AI-powered data analysis with database connections and file uploads, featuring RAG (Retrieval-Augmented Generation) for intelligent insights.

## 🏗️ Project Structure

```
HackCBS 2.0/
├── backend/                 # Express.js + Node.js backend
│   ├── config/             # Configuration files (Firebase, Database)
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth and error middleware
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions (data processing, AI, reports)
│   ├── public/uploads/    # File upload directory
│   └── index.js           # Server entry point
└── frontend/               # React + Vite frontend
    ├── src/
    │   ├── components/    # Reusable components
    │   ├── context/       # React context (Auth)
    │   ├── pages/         # Page components
    │   ├── services/      # API service layer
    │   ├── config/        # Firebase config
    │   └── App.jsx        # Main app component
    └── package.json
```

## 🚀 Features

### Phase 1: User Authentication
- ✅ Firebase Authentication with Google Sign-in
- ✅ Protected routes with automatic redirect
- ✅ Session management with JWT tokens

### Phase 2: Data Input
- ✅ Database connection support (MySQL, PostgreSQL, MongoDB)
- ✅ File upload support (CSV, XLSX)
- ✅ Real-time validation and error handling
- ✅ Engaging loading states with fun facts

### Phase 3: Analytics Dashboard
- ✅ AI-generated insights and summaries
- ✅ Interactive charts (Bar, Line, Pie) using Recharts
- ✅ RAG-powered Q&A chat interface
- ✅ PDF report export functionality

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Firebase project with Authentication enabled
- OpenAI API key (for RAG functionality)

## 🛠️ Setup Instructions

### 1. Backend Setup

```powershell
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Configure .env with your credentials:
# - MongoDB connection string
# - Firebase Admin SDK credentials
# - OpenAI API key
```

**Backend Environment Variables (.env):**
```env
PORT=5000
DB_PATH=mongodb://localhost:27017
DB_NAME=ai_rag_analytics
CORS_ORIGINS=http://localhost:5173
NODE_ENV=development

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# OpenAI API
OPENAI_API_KEY=your-openai-api-key

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./public/uploads
```

### 2. Frontend Setup

```powershell
cd frontend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Configure .env with Firebase client credentials
```

**Frontend Environment Variables (.env):**
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Google Authentication:
   - Go to Authentication > Sign-in method
   - Enable Google provider
4. Get Web App credentials:
   - Project Settings > Your apps > Add web app
   - Copy configuration for frontend .env
5. Get Admin SDK credentials:
   - Project Settings > Service accounts
   - Generate new private key
   - Add credentials to backend .env

### 4. Start Development Servers

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
# App runs on http://localhost:5173
```

## 📡 API Endpoints

### Authentication
- All protected routes require `Authorization: Bearer <token>` header

### User Routes (`/api/v1/user`)
- `GET /me` - Get current user profile
- `PUT /profile` - Update user profile
- `DELETE /account` - Delete user account

### Data Source Routes (`/api/v1/datasource`)
- `POST /database` - Submit database connection
- `POST /file` - Upload file (multipart/form-data)
- `GET /` - Get all user's data sources

### Analysis Routes (`/api/v1/analysis`)
- `GET /` - Get all analyses
- `GET /:id` - Get specific analysis
- `GET /:id/status` - Check analysis status
- `POST /:id/ask` - Ask follow-up question (RAG)
- `GET /:id/export` - Export report as PDF

## 🎨 Technology Stack

### Backend
- **Runtime:** Node.js + Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** Firebase Admin SDK
- **AI/ML:** OpenAI GPT-4 for RAG
- **File Processing:** Multer, XLSX, CSV-Parser
- **Database Connectors:** MySQL2, pg (PostgreSQL)
- **Report Generation:** PDFKit

### Frontend
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **Authentication:** Firebase Client SDK
- **Charts:** Recharts
- **HTTP Client:** Axios

## 🔐 Security Notes

⚠️ **Important for Production:**
1. Encrypt database passwords before storing in MongoDB
2. Use environment-specific CORS origins
3. Implement rate limiting on API endpoints
4. Add request validation and sanitization
5. Use HTTPS in production
6. Store sensitive files outside public directory
7. Implement proper error logging (e.g., Sentry)

## 📝 Development Workflow

### Phase 1: Authentication ✅
1. User lands on login page
2. Signs in with Google
3. Firebase creates session
4. Backend verifies token and creates/updates user in MongoDB

### Phase 2: Data Input ✅
1. User chooses database or file upload
2. Submits credentials/file
3. Backend validates and creates DataSource record
4. Analysis record created with "processing" status
5. Async processing begins

### Phase 3: Analytics ✅
1. Frontend polls for analysis status
2. Shows loading screen with fun facts
3. Once complete, displays:
   - AI-generated summary
   - Key insights
   - Interactive visualizations
4. User can ask follow-up questions via RAG chat
5. Export results as PDF

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify .env variables are set correctly
- Ensure all npm packages are installed

### Frontend authentication fails
- Verify Firebase config in .env
- Check Firebase console for enabled auth providers
- Clear localStorage and try again

### File upload fails
- Check MAX_FILE_SIZE in backend .env
- Ensure `public/uploads/` directory exists
- Verify file type is CSV or XLSX

### Charts not rendering
- Check if analysis data structure matches expected format
- Verify Recharts is installed
- Check browser console for errors

## 📚 Additional Resources

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Recharts Documentation](https://recharts.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📄 License

MIT

## 👥 Contributors

Built for HackCBS 2.0

---

**Happy Coding! 🚀**
