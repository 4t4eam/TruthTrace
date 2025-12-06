import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import factoRoutes from './routes/facto.js';
import factoHistoryRoutes from './routes/factoHistory.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// 라우트
app.use('/api/auth', authRoutes);
app.use('/api/facto', factoRoutes);
app.use('/api/facto/history', factoHistoryRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
