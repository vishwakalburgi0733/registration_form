import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.ts';
import enrollmentRoutes from './routes/enrollmentRoutes';

// Load environment variables from `server/.env` no matter where the process is started from.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to MongoDB
connectDB();

const app: Application = express();
const PORT: number | string = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Example API route (Health Check)
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'Backend is connected to MongoDB and React!',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/enrollments', enrollmentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
