import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('Flowa API is running...');
});

// Import routes
import userRoutes from './routes/userRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import themeRoutes from './routes/themeRoutes.js';
import productRoutes from './routes/productRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import socialMediaRoutes from './routes/socialMediaRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import integrationRoutes from './routes/integrationRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/social', socialMediaRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/settings', settingsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
