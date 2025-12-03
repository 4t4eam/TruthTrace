import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUsers, addUser } from '../lib/googleSheets.js';

const router = express.Router();
const COOKIE_NAME = process.env.COOKIE_NAME || 'factoToken';
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: '모든 필드를 입력하세요.' });

  const users = await getUsers();
  if (users.find(u => u[1] === email)) return res.status(400).json({ error: '이미 존재하는 이메일입니다.' });

  const passwordHash = await bcrypt.hash(password, 10);
  await addUser({ name, email, passwordHash });
  res.json({ success: true });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = await getUsers();
  const user = users.find(u => u[1] === email);
  if (!user) return res.status(400).json({ error: '존재하지 않는 사용자입니다.' });

  const passwordHash = user[2];
  const valid = await bcrypt.compare(password, passwordHash);
  if (!valid) return res.status(400).json({ error: '비밀번호가 일치하지 않습니다.' });

  const token = jwt.sign({ name: user[0], email }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie(COOKIE_NAME, token, { httpOnly: true, maxAge: 7*24*60*60*1000 });
  res.json({ success: true, name: user[0], email });
});

router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ success: true });
});

export default router;
