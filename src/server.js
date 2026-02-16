import cluster from 'node:cluster';
import os from 'node:os';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import jobRoutes from './routes/jobRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import userRoutes from './routes/userRoutes.js';
import youtubeRoutes from './routes/youtubeRoutes.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// --- Cluster mode: fork workers in production ---
if (isProduction && cluster.isPrimary) {
  const numWorkers = Math.min(os.cpus().length, 4);
  console.log(`Primary ${process.pid} starting ${numWorkers} workers...`);

  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code) => {
    console.warn(`Worker ${worker.process.pid} exited (code ${code}). Restarting...`);
    cluster.fork();
  });
} else {
  // --- Single worker / dev mode ---
  const app = express();

  // Connect to MongoDB
  connectDB();

  // Security headers
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  }));

  // Gzip compression — reduces response size by ~70%
  app.use(compression());

  // Rate limiting — prevent abuse
  const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 200, // 200 requests per minute per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Please try again shortly.' },
  });
  app.use('/api/', apiLimiter);

  // CORS Configuration
  const corsOptions = {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  app.use(cors(corsOptions));

  // Body parsing with size limits
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));

  // Static files with caching headers
  app.use('/uploads', express.static('uploads', {
    maxAge: isProduction ? '7d' : 0,
    etag: true,
    lastModified: true,
  }));

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', pid: process.pid, uptime: Math.floor(process.uptime()) });
  });

  // Root
  app.get('/', (req, res) => {
    res.json({
      message: 'LegalHub API is running',
      version: '1.0.0',
    });
  });

  // API Routes
  app.use('/api/jobs', jobRoutes);
  app.use('/api/courses', courseRoutes);
  app.use('/api/appointments', appointmentRoutes);
  app.use('/api/stats', statsRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/youtube', youtubeRoutes);

  // Error Handler
  app.use(errorHandler);

  // Start server
  const server = app.listen(PORT, () => {
    console.log(`Worker ${process.pid} running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  // Graceful shutdown — finish in-flight requests before exiting
  const shutdown = (signal) => {
    console.log(`${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
    // Force exit if not done in 10s
    setTimeout(() => process.exit(1), 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Catch unhandled errors so the process doesn't crash silently
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
    shutdown('uncaughtException');
  });

  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
  });
}
