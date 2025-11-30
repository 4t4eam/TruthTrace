import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import chatRouter from './routes/chat.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// 구글 시트 설정 (.env에서 불러오기)
const USERS_SHEET = 'Users';
const CHAT_SHEET = 'Chat';
const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;

// 미들웨어
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(bodyParser.json());

// 구글 시트 인증
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n')
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// 구글 시트 데이터 읽기
async function getSheetData(sheetName) {
  if (!sheets) throw new Error('Sheets API 초기화 실패');
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: GOOGLE_SHEET_ID,
    range: sheetName,
  });
  return res.data.values || [];
}

// 구글 시트 데이터 쓰기
async function appendSheetData(sheetName, values) {
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: sheetName,
      valueInputOption: 'RAW',
      requestBody: { values: [values] },
    });
  } catch (err) {
    console.error('Google Sheets append error:', err);
    throw err;
  }
}

// 회원가입
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: '모든 필드를 입력하세요.' });

  const users = await getSheetData(USERS_SHEET);
  if (users.find(u => u[0] === email)) return res.status(400).json({ error: '이미 존재하는 이메일입니다.' });

  const hashedPassword = await bcrypt.hash(password, 10);
  await appendSheetData(USERS_SHEET, [email, hashedPassword, name]);

  const token = jwt.sign({ email, name }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, email, name });
});

// 로그인
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: '모든 필드를 입력하세요.' });

  const users = await getSheetData(USERS_SHEET);
  const user = users.find(u => u[0] === email);
  if (!user) return res.status(400).json({ error: '사용자를 찾을 수 없습니다.' });

  const match = await bcrypt.compare(password, user[1]);
  if (!match) return res.status(400).json({ error: '비밀번호가 일치하지 않습니다.' });

  const token = jwt.sign({ email, name: user[2] }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, email, name: user[2] });
});

app.use('/api/chat', chatRouter);

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
