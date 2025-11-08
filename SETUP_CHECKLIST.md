# ✅ Setup Checklist

Before running the application, make sure you complete these steps:

## Prerequisites
- [ ] Node.js v18+ installed
- [ ] MongoDB installed (local) OR MongoDB Atlas account
- [ ] Firebase project created
- [ ] OpenAI API account with credits

## Backend Setup

### 1. Dependencies
- [ ] Navigate to `backend` folder
- [ ] Run `npm install`
- [ ] Verify all packages installed successfully

### 2. Environment Configuration
- [ ] Copy `.env.example` to `.env`
- [ ] Set `PORT` (default: 5000)
- [ ] Set `DB_PATH` (MongoDB connection string)
- [ ] Set `DB_NAME` (database name)
- [ ] Set `CORS_ORIGINS` (frontend URL)

### 3. Firebase Admin SDK (Backend Credentials)

**Step-by-step:**

1. **Go to Firebase Console**
   - [ ] Visit https://console.firebase.google.com/
   - [ ] Sign in with your Google account
   - [ ] Click "Add project" or select existing project

2. **Create/Select Project**
   - [ ] Enter project name (e.g., "ai-analytics-app")
   - [ ] Click "Continue"
   - [ ] Disable Google Analytics (optional) or configure it
   - [ ] Click "Create Project"
   - [ ] Wait for project to be created

3. **Get Admin SDK Credentials**
   - [ ] In Firebase Console, click the gear icon ⚙️ (top left)
   - [ ] Click "Project settings"
   - [ ] Go to "Service accounts" tab
   - [ ] Scroll down to "Firebase Admin SDK"
   - [ ] Select "Node.js" as the language
   - [ ] Click "Generate new private key" button
   - [ ] Click "Generate key" in the popup dialog
   - [ ] A JSON file will download automatically

4. **Copy Credentials to Backend .env**
   - [ ] Open the downloaded JSON file in a text editor
   - [ ] Find `"project_id"` → Copy value to `FIREBASE_PROJECT_ID` in backend/.env
   - [ ] Find `"private_key"` → Copy ENTIRE value (including \n) to `FIREBASE_PRIVATE_KEY`
   - [ ] Find `"client_email"` → Copy value to `FIREBASE_CLIENT_EMAIL`

   **Example:**
   ```
   FIREBASE_PROJECT_ID=my-project-12345
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@my-project-12345.iam.gserviceaccount.com
   ```

   ⚠️ **Important:** Keep the quotes around the private key if it contains \n characters!

### 4. OpenAI API

**Step-by-step:**

1. **Create OpenAI Account**
   - [ ] Go to https://platform.openai.com/
   - [ ] Click "Sign up" (or "Log in" if you have an account)
   - [ ] Complete the registration process
   - [ ] Verify your email address

2. **Add Payment Method (Required)**
   - [ ] Go to https://platform.openai.com/account/billing
   - [ ] Click "Add payment method"
   - [ ] Enter your credit card details
   - [ ] OpenAI requires a payment method even for free tier usage
   - [ ] They offer $5 free credits for new users (check current promotion)

3. **Create API Key**
   - [ ] Go to https://platform.openai.com/api-keys
   - [ ] Click "+ Create new secret key" button
   - [ ] Enter a name (e.g., "AI Analytics Backend")
   - [ ] Click "Create secret key"
   - [ ] **IMPORTANT:** Copy the key immediately - it won't be shown again!
   - [ ] It looks like: `sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

4. **Add to Backend .env**
   - [ ] Open `backend/.env`
   - [ ] Paste the key: `OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
   - [ ] Save the file

5. **Verify Credits**
   - [ ] Go to https://platform.openai.com/account/usage
   - [ ] Check you have available credits
   - [ ] Each analysis will cost approximately $0.10-$0.50 depending on data size

**Important Notes:**
- ⚠️ Keep your API key secret - never commit it to GitHub
- 💰 Monitor your usage to avoid unexpected charges
- 🔒 The key starts with `sk-proj-` or `sk-` followed by random characters
- 🔑 If you lose the key, you can't recover it - just create a new one

**Free Tier Info:**
- New users typically get $5 free credits
- Credits expire after 3 months
- GPT-4 costs more than GPT-3.5 (this app uses GPT-4 for better insights)

### 5. File Upload Directory
- [ ] Verify `public/uploads/` folder exists
- [ ] Check folder permissions (write access needed)

## Frontend Setup

### 1. Dependencies
- [ ] Navigate to `frontend` folder
- [ ] Run `npm install`
- [ ] Verify all packages installed successfully

### 2. Environment Configuration
- [ ] Copy `.env.example` to `.env`
- [ ] Set `VITE_API_URL` (backend URL, default: http://localhost:5000/api/v1)

### 3. Firebase Client SDK (Frontend Credentials)

**Step-by-step:**

1. **Go to Firebase Console**
   - [ ] Visit https://console.firebase.google.com/
   - [ ] Select your project (same one used for backend)

2. **Add Web App**
   - [ ] In the project overview page, look for "Get started by adding Firebase to your app"
   - [ ] Click the **Web icon** `</>` (fourth icon after iOS and Android)
   - [ ] If you don't see it, click the gear icon ⚙️ → Project Settings → Scroll down to "Your apps"

3. **Register Web App**
   - [ ] Enter app nickname (e.g., "Web App" or "Analytics Frontend")
   - [ ] ❌ **DO NOT** check "Firebase Hosting" (we're using Vite)
   - [ ] Click "Register app"

4. **Copy Firebase SDK Configuration**
   - [ ] You'll see a code snippet like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "my-project-12345.firebaseapp.com",
     projectId: "my-project-12345",
     storageBucket: "my-project-12345.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef1234567890"
   };
   ```

5. **Copy Each Value to Frontend .env**
   - [ ] Copy `apiKey` value → `VITE_FIREBASE_API_KEY`
   - [ ] Copy `authDomain` value → `VITE_FIREBASE_AUTH_DOMAIN`
   - [ ] Copy `projectId` value → `VITE_FIREBASE_PROJECT_ID`
   - [ ] Copy `storageBucket` value → `VITE_FIREBASE_STORAGE_BUCKET`
   - [ ] Copy `messagingSenderId` value → `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - [ ] Copy `appId` value → `VITE_FIREBASE_APP_ID`

   **Example frontend/.env:**
   ```
   VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   VITE_FIREBASE_AUTH_DOMAIN=my-project-12345.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=my-project-12345
   VITE_FIREBASE_STORAGE_BUCKET=my-project-12345.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
   ```

   ⚠️ **Important:** All values should be WITHOUT quotes in the .env file!

6. **Click "Continue to Console"**
   - [ ] You can always find these values later in:
   - [ ] Firebase Console → Project Settings → Scroll down to "Your apps" → Web app

### 4. Firebase Authentication (Enable Google Sign-In)

**Step-by-step:**

1. **Navigate to Authentication**
   - [ ] In Firebase Console, click "Authentication" in the left sidebar
   - [ ] If you see "Get started", click it to enable Authentication

2. **Go to Sign-in Method**
   - [ ] Click the "Sign-in method" tab at the top
   - [ ] You'll see a list of sign-in providers

3. **Enable Google Provider**
   - [ ] Find "Google" in the list
   - [ ] Click on "Google" row
   - [ ] Toggle the "Enable" switch to ON
   - [ ] Enter "Project support email" (your email address)
   - [ ] Click "Save"

4. **Configure Authorized Domains (for Development)**
   - [ ] Still in "Sign-in method" tab, scroll down to "Authorized domains"
   - [ ] By default, `localhost` should already be there
   - [ ] If not, click "Add domain" and add: `localhost`
   - [ ] For production, add your actual domain later

5. **Verify Setup**
   - [ ] Google provider should now show "Enabled" status
   - [ ] You should see it in the "Sign-in providers" list

**Additional Providers (Optional):**
- [ ] You can also enable Email/Password, Facebook, GitHub, etc.
- [ ] For this app, Google is the primary provider

**Note:** The app is configured for Google sign-in by default. If you want to add more providers, you'll need to update the frontend code in `src/context/AuthContext.jsx`

## Database Setup

### Local MongoDB
- [ ] MongoDB service is running
- [ ] Can connect to `mongodb://localhost:27017`
- [ ] Database will be created automatically on first run

### MongoDB Atlas (Cloud)
- [ ] Cluster created
- [ ] Database user created with password
- [ ] IP whitelist configured (or allow all: 0.0.0.0/0)
- [ ] Connection string copied to `.env`

## Testing the Setup

### Backend Test
- [ ] Open terminal in `backend` folder
- [ ] Run `npm run dev`
- [ ] Should see: "Server running on http://localhost:5000"
- [ ] Should see: "MongoDB Connected"
- [ ] Visit http://localhost:5000/health in browser
- [ ] Should see JSON: `{"success": true, "message": "Server is running"}`

### Frontend Test
- [ ] Open new terminal in `frontend` folder
- [ ] Run `npm run dev`
- [ ] Should see: "Local: http://localhost:5173"
- [ ] Visit http://localhost:5173 in browser
- [ ] Should see login page
- [ ] No console errors

## First Run Test

### Complete Flow Test
- [ ] Click "Sign in with Google" on login page
- [ ] Successfully authenticate
- [ ] Redirect to home page
- [ ] See data input options (Database / File)
- [ ] Try uploading a sample CSV file OR
- [ ] Try connecting to a test database
- [ ] See processing screen with fun facts
- [ ] After 2-3 minutes, see analysis results
- [ ] View charts and insights
- [ ] Ask a question in chat panel
- [ ] Get AI response
- [ ] Export PDF report

## Troubleshooting

If any step fails, check:

### Backend Issues
- [ ] All .env variables are set correctly
- [ ] No typos in Firebase credentials
- [ ] MongoDB is accessible
- [ ] Port 5000 is not in use by another app
- [ ] OpenAI API key is valid and has credits

### Frontend Issues
- [ ] All .env variables are set correctly
- [ ] Backend is running on correct port
- [ ] Firebase config matches project
- [ ] Google auth provider is enabled
- [ ] No browser extensions blocking requests

### Authentication Issues
- [ ] Firebase project ID matches in both .env files
- [ ] Google provider is enabled in Firebase Console
- [ ] Authorized domains include localhost
- [ ] Browser allows third-party cookies
- [ ] Clear localStorage and try again

### Analysis Issues
- [ ] OpenAI API key is valid
- [ ] File is valid CSV or XLSX
- [ ] Database credentials are correct
- [ ] Check backend console for error logs
- [ ] Ensure uploads folder has write permissions

---

## ✅ When All Boxes Are Checked

You're ready to use the AI-Driven DB RAG & Analytics System!

**Next Steps:**
1. Read the [README.md](README.md) for full documentation
2. Check [QUICKSTART.md](QUICKSTART.md) for quick commands
3. Review [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for architecture details

**Need Help?**
- Check Firebase Console for auth errors
- Check MongoDB logs for connection issues
- Check browser console for frontend errors
- Check terminal/console for backend errors

Good luck! 🚀
