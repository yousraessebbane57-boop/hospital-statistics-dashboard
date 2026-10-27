import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import accouchementsRoutes from './routes/accouchements.js';
import accouchementsImportRoutes from './routes/accouchementsImport.js';
import rapportsRoutes from './routes/rapports.js';
import adminAuthRoutes from './routes/adminAuth.js';
import adminRoutes from './routes/admin.js';
import { requireSession } from './middleware/adminAuth.js';

dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/admin/auth/login', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
}));

app.use('/api/accouchements/import', requireSession, accouchementsImportRoutes);
app.use('/api/accouchements', requireSession, accouchementsRoutes);
app.use('/api/rapports', requireSession, rapportsRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use((error, req, res, next) => {
  console.error(`${req.method} ${req.originalUrl}`, error);
  res.status(500).json({ error: 'Erreur interne du serveur.' });
});

app.listen(PORT, () => {
  console.log(`Serveur sur http://localhost:${PORT}`);
});
