# Vercel Environment Variables for Frontend

## IMPORTANT: Fix Double Slash Issue

The error logs show double slashes in the URLs: `https://fusion-forums-backend.vercel.app//api/threads/recent`

This is causing your CORS errors. Follow these steps to fix it:

## 1. Update Vercel Environment Variables

Go to your Vercel dashboard for the frontend project, navigate to Settings > Environment Variables, and set these values:

```
NEXT_PUBLIC_URL=https://fusion-forums-backend.vercel.app
NEXT_PUBLIC_API_URL=https://fusion-forums-backend.vercel.app/api
NEXT_PUBLIC_SERVER_IP=fusion-network.xyz
```

## 2. Fix Your API Calls in the Code

You need to make sure your code is using the environment variables correctly:

### For API calls, use NEXT_PUBLIC_API_URL without adding /api

```javascript
// CORRECT - This will produce https://fusion-forums-backend.vercel.app/api/threads/recent
fetch(`${process.env.NEXT_PUBLIC_API_URL}/threads/recent`)

// INCORRECT - This will produce https://fusion-forums-backend.vercel.app//api/threads/recent
fetch(`${process.env.NEXT_PUBLIC_URL}/api/threads/recent`)
```

## 3. Test Your API Connection

After deployment, test if your backend is accessible by visiting:

```
https://fusion-forums-backend.vercel.app/api/diagnostic
```

This should return a JSON response with diagnostic information about your API.
