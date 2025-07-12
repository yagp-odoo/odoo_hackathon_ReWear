# ReWear Project Setup Guide

## 🚀 Quick Setup

### 1. Frontend Environment Variables

Create a `.env` file in the `Frontend/` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:8001

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# Optional: Development settings
VITE_APP_ENV=development
```

### 2. Backend Environment Variables

Create a `.env` file in the `Backend/` directory:

```env
# Database Configuration
Database_Link=your_mongodb_connection_string

# JWT Configuration
SECRET_KEY=your_secret_key_here
Algorithm=HS256
Access_Token_Expire_Time=60

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8001/auth/google/callback

# Service Configuration
AUTH_SERVICE_URL=http://localhost:8001
```

## 🔧 Google OAuth Setup

### Step 1: Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API

### Step 2: Create OAuth Credentials
1. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
2. Set application type to **"Web application"**
3. Add authorized JavaScript origins:
   - `http://localhost:5173` (Frontend dev server)
   - `http://localhost:3000` (Alternative frontend port)
4. Add authorized redirect URIs:
   - `http://localhost:8001/auth/google/callback` (Backend callback)
5. Copy the **Client ID** and **Client Secret**

### Step 3: Update Environment Files
- Add the Client ID to `Frontend/.env` as `VITE_GOOGLE_CLIENT_ID`
- Add both Client ID and Secret to `Backend/.env`

## 🗄️ Database Setup

### MongoDB Setup
1. Create a MongoDB database (local or cloud)
2. Get your connection string
3. Add it to `Backend/.env` as `Database_Link`

Example connection string:
```
mongodb://localhost:27017/rewear
```

## 🏃‍♂️ Running the Project

### Backend
```bash
cd Backend/auth
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

### Frontend
```bash
cd Frontend
npm install
npm run dev
```

## ✅ What's Working Now

### Backend APIs
- ✅ User registration and login
- ✅ Google OAuth authentication
- ✅ User profile management (`/user/me`)
- ✅ Session management with JWT
- ✅ Protected routes

### Frontend Features
- ✅ Real API integration
- ✅ Authentication context
- ✅ Protected routes
- ✅ Dashboard with real user data
- ✅ Google OAuth button
- ✅ User profile display

### Dashboard Integration
- ✅ Fetches real user data from `/user/me`
- ✅ Displays user stats (points, swaps, items, favorites)
- ✅ Shows user profile information
- ✅ Calculates eco impact based on swaps
- ✅ Loading states and error handling

## 🔍 Troubleshooting

### "Google authentication not configured"
- Make sure `VITE_GOOGLE_CLIENT_ID` is set in `Frontend/.env`
- Verify Google OAuth credentials are correct

### API connection issues
- Check that backend is running on port 8001
- Verify `VITE_API_URL` in frontend `.env`
- Ensure CORS is properly configured

### Database connection issues
- Verify MongoDB connection string
- Check that MongoDB is running
- Ensure database permissions are correct

## 📝 Next Steps

1. Set up your environment variables
2. Configure Google OAuth credentials
3. Start the backend server
4. Start the frontend development server
5. Test the authentication flow
6. Verify dashboard loads with real user data

The project is now fully connected with real APIs and ready for development! 