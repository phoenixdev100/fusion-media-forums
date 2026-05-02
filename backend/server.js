const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const forumRoutes = require('./routes/forums');
const postRoutes = require('./routes/posts');
const threadRoutes = require('./routes/threads');
const forumStatsRoutes = require('./routes/forumStats');
const adminRoutes = require('./routes/adminRoutes');
const serverStatusRoutes = require('./routes/serverStatus');
const testRoutes = require('./routes/testRoutes');
const uploadsRoutes = require('./routes/uploads');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if(!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000', 
      process.env.FRONTEND_URL, 
      'https://fusion-forums-backend.vercel.app',
      'https://fusion-forums-frontend.vercel.app'
    ];
    
    // For debugging
    console.log('Request origin:', origin);
    console.log('Allowed origins:', allowedOrigins);
    
    if(allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'Cache-Control', 'Pragma']
}));
app.use(express.json());
app.use(morgan('dev'));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Handle preflight requests
app.options('*', cors());

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/forums', forumRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/threads', threadRoutes);
app.use('/api/forum-stats', forumStatsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/server-status', serverStatusRoutes);
app.use('/api/test', testRoutes);
app.use('/api/uploads', uploadsRoutes);

// Root route - must be defined after all other routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Fusion Network Forum API' });
});

// Test endpoint for CORS and URL diagnostics
app.get('/api/diagnostic', (req, res) => {
  // Set CORS headers explicitly for this endpoint
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  
  res.json({ 
    message: 'API Diagnostic Information', 
    request: {
      origin: req.headers.origin || 'No origin header',
      url: req.url,
      method: req.method,
      path: req.path,
      headers: req.headers
    },
    environment: {
      nodeEnv: process.env.NODE_ENV,
      frontendUrl: process.env.FRONTEND_URL,
      corsSettings: {
        allowedOrigins: ['http://localhost:3000', process.env.FRONTEND_URL, 'https://fusion-forums-backend.vercel.app', 'https://fusion-forums-frontend.vercel.app']
      }
    },
    timestamp: new Date().toISOString()
  });
});

// Root API endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    name: 'Fusion Network Forum API',
    version: '1.0.0',
    description: 'API for the Fusion Network Minecraft server forum',
    endpoints: {
      auth: '/api/auth - Authentication endpoints',
      users: '/api/users - User management endpoints',
      forums: '/api/forums - Forum categories and threads',
      threads: '/api/threads - Thread management endpoints',
      posts: '/api/posts - Forum posts and replies',
      admin: '/api/admin - Admin dashboard endpoints',
      health: '/api/health - API health check',
      serverInfo: '/api/server-info - Minecraft server information'
    }
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Fusion Network Forum API is running' });
});

// Import Minecraft server status utility
const { getMinecraftServerStatus } = require('./utils/minecraftServerStatus');

// Server info route
app.get('/api/server-info', async (req, res) => {
  try {
    const serverAddress = process.env.SERVER_IP || 'fusion-network.xyz';
    const serverStatus = await getMinecraftServerStatus(serverAddress);
    
    res.status(200).json({
      name: 'Fusion Network',
      address: serverAddress,
      version: serverStatus.version,
      online: serverStatus.online,
      players: serverStatus.players,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching server info:', error);
    res.status(500).json({
      name: 'Fusion Network',
      address: process.env.SERVER_IP,
      online: false,
      error: 'Could not fetch server status'
    });
  }
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fusion-network-forum');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

connectDB();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: true,
    message: err.message || 'An unexpected error occurred'
  });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Export the Express API for Vercel
module.exports = app;
