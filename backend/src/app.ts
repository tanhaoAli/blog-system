import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors'; // Handle async errors
import { errorHandler } from './middlewares/errorHandler';
import routes from './routes';

const app = express();

// Security Middlewares 
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: '*', // For development. In production, specify exact origins
  credentials: true
}));

// Request Parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Logging
app.use(morgan('dev'));

// Static folder for uploads (e.g. avatars, covers)
app.use('/uploads', express.static('public/uploads'));

// API Routes
app.use('/api/v1', routes);

// Global Error Handler
app.use(errorHandler);

export default app;