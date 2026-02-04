<div align="center">

# 🚀 Deployment Guide

### *Deploy Fusion Network Forum to Production*

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Backend Deployment](#backend-deployment)
  - [Railway](#deploy-to-railway)
  - [Render](#deploy-to-render)
  - [Heroku](#deploy-to-heroku)
- [Frontend Deployment](#frontend-deployment)
  - [Vercel](#deploy-to-vercel)
  - [Netlify](#deploy-to-netlify)
- [Database Setup](#database-setup)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

---

<div align="center">

## 🌟 Overview

</div>

This guide will walk you through deploying the Fusion Network Forum to production. We'll deploy:

- **Backend**: Node.js/Express API
- **Frontend**: Next.js application
- **Database**: MongoDB Atlas

**Recommended Stack:**
- Backend: Railway or Render
- Frontend: Vercel
- Database: MongoDB Atlas

---

<div align="center">

## ✅ Prerequisites

</div>

Before deploying, ensure you have:

- [ ] GitHub account
- [ ] MongoDB Atlas account (free tier available)
- [ ] Vercel account (for frontend)
- [ ] Railway/Render account (for backend)
- [ ] Domain name (optional)

---

<div align="center">

## ⚙️ Environment Setup

</div>

### 1. Prepare Your Repository

Ensure your code is pushed to GitHub:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Create Environment Files

You'll need to set environment variables on each platform.

---

<div align="center">

## 🗄️ Database Setup

</div>

### MongoDB Atlas Setup

#### Step 1: Create Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new project

#### Step 2: Create Cluster

1. Click "Build a Database"
2. Choose **FREE** tier (M0)
3. Select a cloud provider and region (closest to your users)
4. Name your cluster (e.g., "fusion-forum")
5. Click "Create"

#### Step 3: Configure Database Access

1. Go to **Database Access**
2. Click "Add New Database User"
3. Create a username and strong password
4. Set privileges to "Read and write to any database"
5. Click "Add User"

#### Step 4: Configure Network Access

1. Go to **Network Access**
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production, restrict to your server IPs
4. Click "Confirm"

#### Step 5: Get Connection String

1. Go to **Database** → **Connect**
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with your database name (e.g., "fusion-forum")

**Example:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/fusion-forum?retryWrites=true&w=majority
```

---

<div align="center">

## 🖥️ Backend Deployment

</div>

---

<div align="center">

### 🚂 Deploy to Railway

</div>

Railway is recommended for its simplicity and free tier.

#### Step 1: Create Railway Account

1. Go to [Railway](https://railway.app/)
2. Sign up with GitHub

#### Step 2: Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Select the `backend` directory

#### Step 3: Configure Build Settings

Railway should auto-detect Node.js. If not:

1. Go to **Settings**
2. Set **Root Directory**: `backend`
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `npm start`

#### Step 4: Add Environment Variables

Go to **Variables** and add:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/fusion-forum
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
FRONTEND_URL=https://your-frontend-domain.vercel.app
MAX_FILE_SIZE=5242880
```

**Generate a secure JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Step 5: Deploy

1. Railway will automatically deploy
2. Wait for deployment to complete
3. Copy your backend URL (e.g., `https://your-app.railway.app`)

---

<div align="center">

### 🎨 Deploy to Render

</div>

Alternative to Railway with similar features.

#### Step 1: Create Render Account

1. Go to [Render](https://render.com/)
2. Sign up with GitHub

#### Step 2: Create Web Service

1. Click "New +"
2. Select "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: fusion-forum-backend
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

#### Step 3: Add Environment Variables

Add the same environment variables as Railway.

#### Step 4: Deploy

1. Click "Create Web Service"
2. Wait for deployment
3. Copy your backend URL

---

<div align="center">

### 🔷 Deploy to Heroku

</div>

Classic platform with robust features.

#### Step 1: Install Heroku CLI

```bash
# Windows (using Chocolatey)
choco install heroku-cli

# Or download from https://devcenter.heroku.com/articles/heroku-cli
```

#### Step 2: Login to Heroku

```bash
heroku login
```

#### Step 3: Create Heroku App

```bash
cd backend
heroku create fusion-forum-backend
```

#### Step 4: Set Environment Variables

```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="your_mongodb_connection_string"
heroku config:set JWT_SECRET="your_jwt_secret"
heroku config:set FRONTEND_URL="https://your-frontend.vercel.app"
```

#### Step 5: Deploy

```bash
git subtree push --prefix backend heroku main
```

Or set up automatic deployments from GitHub in Heroku dashboard.

---

<div align="center">

## 🎨 Frontend Deployment

</div>

---

<div align="center">

### ▲ Deploy to Vercel

</div>

**Recommended** - Vercel is optimized for Next.js.

#### Step 1: Create Vercel Account

1. Go to [Vercel](https://vercel.com/)
2. Sign up with GitHub

#### Step 2: Import Project

1. Click "Add New Project"
2. Import your GitHub repository
3. Vercel will auto-detect Next.js

#### Step 3: Configure Project

1. **Root Directory**: `frontend`
2. **Framework Preset**: Next.js
3. **Build Command**: `npm run build` (auto-detected)
4. **Output Directory**: `.next` (auto-detected)

#### Step 4: Add Environment Variables

Click "Environment Variables" and add:

```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
NEXT_PUBLIC_SERVER_IP=fusion-network.xyz
```

**Important**: Replace `your-backend.railway.app` with your actual backend URL.

#### Step 5: Deploy

1. Click "Deploy"
2. Wait for deployment (usually 1-2 minutes)
3. Your site will be live at `https://your-project.vercel.app`

#### Step 6: Configure Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

---

<div align="center">

### 🌐 Deploy to Netlify

</div>

Alternative to Vercel.

#### Step 1: Create Netlify Account

1. Go to [Netlify](https://www.netlify.com/)
2. Sign up with GitHub

#### Step 2: Import Project

1. Click "Add new site"
2. Import from GitHub
3. Select your repository

#### Step 3: Configure Build Settings

```
Base directory: frontend
Build command: npm run build
Publish directory: frontend/.next
```

#### Step 4: Add Environment Variables

Same as Vercel configuration.

#### Step 5: Deploy

Click "Deploy site" and wait for completion.

---

<div align="center">

## 🔄 Post-Deployment

</div>

### 1. Update Frontend with Backend URL

After deploying the backend, update your frontend environment variables:

1. Go to Vercel dashboard
2. **Settings** → **Environment Variables**
3. Update `NEXT_PUBLIC_API_URL` with your backend URL
4. Redeploy the frontend

### 2. Update Backend CORS

Ensure your backend allows requests from your frontend domain:

In `backend/server.js`:
```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true
};
app.use(cors(corsOptions));
```

### 3. Test the Deployment

1. ✅ Visit your frontend URL
2. ✅ Register a new account
3. ✅ Login
4. ✅ Create a thread
5. ✅ Create a post
6. ✅ Upload an image
7. ✅ Check all pages load correctly

### 4. Initialize Database

If you want to seed initial data:

```bash
# Connect to your backend
# Run initialization scripts if available
```

### 5. Set Up Monitoring

#### Vercel Analytics
1. Go to Vercel dashboard
2. Enable Analytics for your project

#### Railway/Render Monitoring
- Check logs regularly
- Set up alerts for errors

---

<div align="center">

## 🔒 Security Checklist

</div>

Before going live:

- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable HTTPS (automatic on Vercel/Railway)
- [ ] Restrict MongoDB network access to server IPs
- [ ] Use strong database passwords
- [ ] Enable rate limiting
- [ ] Set up CORS properly
- [ ] Don't commit `.env` files
- [ ] Review all environment variables
- [ ] Set up regular backups
- [ ] Enable MongoDB authentication

---

<div align="center">

## 🐛 Troubleshooting

</div>

### Backend Issues

#### "Cannot connect to database"
- ✅ Check MongoDB connection string
- ✅ Verify database user credentials
- ✅ Check network access settings (allow 0.0.0.0/0)
- ✅ Ensure database name is correct

#### "JWT token invalid"
- ✅ Verify JWT_SECRET is set
- ✅ Check token expiration
- ✅ Ensure same secret on all instances

#### "CORS errors"
- ✅ Check FRONTEND_URL environment variable
- ✅ Verify CORS configuration in server.js
- ✅ Ensure credentials: true is set

### Frontend Issues

#### "API request failed"
- ✅ Check NEXT_PUBLIC_API_URL is correct
- ✅ Verify backend is running
- ✅ Check browser console for errors
- ✅ Ensure backend URL includes `/api`

#### "Environment variables not working"
- ✅ Prefix with `NEXT_PUBLIC_` for client-side
- ✅ Redeploy after changing variables
- ✅ Clear browser cache

#### "Build failed"
- ✅ Check build logs
- ✅ Verify all dependencies are in package.json
- ✅ Ensure Node version compatibility

### Database Issues

#### "Slow queries"
- ✅ Add indexes to frequently queried fields
- ✅ Optimize queries
- ✅ Consider upgrading MongoDB tier

#### "Connection timeout"
- ✅ Check network access whitelist
- ✅ Verify connection string format
- ✅ Increase connection timeout

---

<div align="center">

## 📊 Performance Optimization

</div>

### Backend Optimization

```javascript
// Enable compression
const compression = require('compression');
app.use(compression());

// Add caching headers
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300');
  next();
});
```

### Frontend Optimization

1. **Enable Image Optimization** (Next.js built-in)
2. **Use Static Generation** where possible
3. **Implement lazy loading**
4. **Minimize bundle size**

### Database Optimization

```javascript
// Add indexes
await Thread.createIndex({ category: 1, createdAt: -1 });
await Post.createIndex({ thread: 1, createdAt: 1 });
await User.createIndex({ email: 1 }, { unique: true });
```

---

<div align="center">

## 🔄 Continuous Deployment

</div>

### Automatic Deployments

Both Vercel and Railway support automatic deployments:

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Automatic Build & Deploy**
   - Vercel/Railway detects changes
   - Runs build automatically
   - Deploys to production

### Branch Deployments

Create preview deployments for branches:

1. Push to a feature branch
2. Get a preview URL
3. Test before merging to main

---

<div align="center">

## 📈 Scaling

</div>

### When to Scale

Monitor these metrics:
- Response time > 1 second
- CPU usage > 80%
- Memory usage > 80%
- Database connections maxed out

### Scaling Options

#### Backend
- Upgrade Railway/Render plan
- Add more instances
- Implement caching (Redis)
- Use CDN for static assets

#### Frontend
- Vercel scales automatically
- Implement ISR (Incremental Static Regeneration)
- Use edge functions

#### Database
- Upgrade MongoDB Atlas tier
- Add read replicas
- Implement sharding

---

<div align="center">

## 🔐 Backup Strategy

</div>

### Database Backups

#### MongoDB Atlas
1. Go to **Backup** tab
2. Enable **Cloud Backup**
3. Configure backup schedule
4. Test restore process

#### Manual Backup
```bash
mongodump --uri="your_connection_string" --out=./backup
```

### Code Backups

- ✅ Use Git for version control
- ✅ Push to GitHub regularly
- ✅ Tag releases
- ✅ Keep production branch stable

---

<div align="center">

## 📞 Support

</div>

If you encounter issues:

1. 📖 Check this deployment guide
2. 🔍 Review platform documentation
   - [Vercel Docs](https://vercel.com/docs)
   - [Railway Docs](https://docs.railway.app/)
   - [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
3. 🐛 Check GitHub issues
4. 💬 Ask in community forums

---

<div align="center">

## ✅ Deployment Checklist

</div>

### Pre-Deployment
- [ ] Code is tested locally
- [ ] Environment variables documented
- [ ] Database is set up
- [ ] Secrets are generated
- [ ] Dependencies are up to date

### Deployment
- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] Database connected
- [ ] Environment variables set
- [ ] CORS configured

### Post-Deployment
- [ ] All features tested
- [ ] Error monitoring set up
- [ ] Backups configured
- [ ] Performance optimized
- [ ] Security reviewed
- [ ] Documentation updated

---

<div align="center">

## 🎉 Congratulations!

Your Fusion Network Forum is now live! 🚀

**Made with 💚 by Deepak**

</div>
