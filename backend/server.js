import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.routes.js';
import jobRoutes from './src/routes/jobs.routes.js';
// import userRoutes from './src/routes/users.routes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(503).json({ message: "Database connection failed", error: error.message });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
// app.use('/api/users', userRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
