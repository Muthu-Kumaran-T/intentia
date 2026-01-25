const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test Cloudinary connection (optional - for debugging)
const testCloudinaryConnection = async () => {
  try {
    const { cloudinary } = require('./config/cloudinary');
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connected successfully!');
    console.log('📦 Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
  } catch (err) {
    console.error('❌ Cloudinary connection failed:', err.message);
    console.log('🔍 Please check your Cloudinary credentials in .env file:');
    console.log('   CLOUDINARY_CLOUD_NAME=', process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET');
    console.log('   CLOUDINARY_API_KEY=', process.env.CLOUDINARY_API_KEY ? '***SET***' : 'NOT SET');
    console.log('   CLOUDINARY_API_SECRET=', process.env.CLOUDINARY_API_SECRET ? '***SET***' : 'NOT SET');
  }
};

// Run Cloudinary test
testCloudinaryConnection();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/post'));
app.use('/api/user', require('./routes/user'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Intentia API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle Multer errors (file upload errors)
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size is too large. Maximum size is 10MB.'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field in file upload.'
      });
    }
  }
  
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('🚀 Intentia Server Started');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
});