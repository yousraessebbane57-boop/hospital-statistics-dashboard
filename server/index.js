import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import accouchementsRoutes from './routes/accouchements.js';
import accouchementsImportRoutes from './routes/accouchementsImport.js';
import rapportsRoutes from './routes/rapports.js';

dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/accouchements/import', accouchementsImportRoutes);
app.use('/api/accouchements', accouchementsRoutes);
app.use('/api/rapports', rapportsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Serveur sur http://localhost:${PORT}`);
});
