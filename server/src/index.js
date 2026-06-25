import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import agentRoutes from './routes/agentRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Body Parsers
app.use(express.json());

// Bind Routes
app.use('/api', agentRoutes);

// Base route for server verification
app.get('/', (req, res) => {
  res.json({
    message: 'AgriSathi AI - Agentic Farming Decision API is running',
    version: '1.0.0'
  });
});

// Start Database & Listen
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[SERVER] AgriSathi AI API Server running on port ${PORT}`);
  });
};

startServer();
