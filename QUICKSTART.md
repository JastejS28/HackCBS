# 🚀 Quick Start Guide

## Step 1: Install Backend Dependencies

```powershell
cd backend
npm install
```

## Step 2: Configure Backend

1. Copy the example environment file:
```powershell
copy .env.example .env
```

2. Edit `.env` and add your credentials:
   - MongoDB connection string
   - Firebase Admin SDK credentials
   - OpenAI API key

## Step 3: Install Frontend Dependencies

```powershell
cd ../frontend
npm install
```

## Step 4: Configure Frontend

1. Copy the example environment file:
```powershell
copy .env.example .env
```

2. Edit `.env` and add your Firebase client credentials

## Step 5: Start MongoDB

Make sure MongoDB is running on your machine:
```powershell
# If using local MongoDB
mongod
```

Or use MongoDB Atlas (cloud database)

## Step 6: Start Backend Server

```powershell
cd backend
npm run dev
```

You should see:
```
✓ Server running on http://localhost:5000
✓ Environment: development
✓ MongoDB Connected
```

## Step 7: Start Frontend

In a new terminal:
```powershell
cd frontend
npm run dev
```

You should see:
```
VITE ready in XXX ms
➜ Local: http://localhost:5173/
```

## Step 8: Open the App

Visit http://localhost:5173 in your browser and sign in with Google!

---

## Common Issues

### "Cannot connect to MongoDB"
- Make sure MongoDB is running
- Check your DB_PATH in backend/.env

### "Firebase auth error"
- Verify Firebase credentials in both .env files
- Check if Google auth is enabled in Firebase Console

### "Module not found"
- Run `npm install` in both backend and frontend directories

### Port already in use
- Change PORT in backend/.env
- Frontend port can be changed in vite.config.js

---

## Next Steps

1. ✅ Sign in with Google
2. ✅ Upload a CSV file or connect to a database
3. ✅ Wait for AI analysis (2-3 minutes)
4. ✅ View insights and charts
5. ✅ Ask questions about your data
6. ✅ Export report as PDF

Enjoy! 🎉
