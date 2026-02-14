import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import adsRoutes from './routes/ads';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middlewares
app.use(helmet());
app.use(cors());
// Explicitly cast express.json() to resolve type mismatch in app.use overloads
app.use(express.json() as any);

// Rute
app.use('/auth', authRoutes);
app.use('/ads', adsRoutes);

// API rute sa prefiksom
app.use('/api/auth', authRoutes);
app.use('/api/ads', adsRoutes);

// Health check with type casting for response methods
app.get('/health', (req, res) => {
  (res as any).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware with fixed types and explicit casting for status/json
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  (res as any).status(500).json({ error: 'Nešto je pošlo po zlu na serveru' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server spreman na http://localhost:${PORT}`);
});
