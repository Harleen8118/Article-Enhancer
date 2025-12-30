import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import articlesRouter from './routes/articles.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/articles', articlesRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/beyondchats';
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 API available at http://localhost:${PORT}/api/articles`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    console.log('\n💡 To set up MongoDB:');
    console.log('   Option 1: Install MongoDB locally (https://www.mongodb.com/try/download/community)');
    console.log('   Option 2: Use MongoDB Atlas free tier (https://www.mongodb.com/cloud/atlas)');
    console.log('\n   Then update MONGODB_URI in .env file');
    process.exit(1);
  }
};

startServer();
