import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import companyRoutes from './routes/companyRoutes';
import authRoutes from './routes/authRoutes';
import './config/database';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/companies', companyRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Kangaroute API is running' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err);
});

export default app;