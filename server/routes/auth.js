import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { readRange, appendRow, SHEETS } from "../google/sheets.js";
import "dotenv/config";

const router = express.Router();

// 회원가입
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "이메일과 패스워드가 필요합니다." });

    // 시트에서 전체 Users 읽기
    const rows = await readRange(SHEETS.USERS, "A:D");

    const exists = rows.find((r) => r[1] === email);
    if (exists)
      return res.status(400).json({ error: "이미 존재하는 이메일입니다." });

    const passwordHash = await bcrypt.hash(password, 10);

    const userId = uuid();
    const createdAt = new Date().toISOString();

    await appendRow(SHEETS.USERS, [userId, email, passwordHash, createdAt]);

    return res.json({ success: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "서버 오류" });
  }
});

// 로그인
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const rows = await readRange(SHEETS.USERS, "A:D");

    const user = rows.find((r) => r[1] === email);
    if (!user) return res.status(400).json({ error: "존재하지 않는 이메일" });

    const passwordHash = user[2];
    const match = await bcrypt.compare(password, passwordHash);

    if (!match) return res.status(400).json({ error: "비밀번호가 다릅니다." });

    const token = jwt.sign(
      { userId: user[0], email: user[1] },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie(process.env.COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "서버 오류" });
  }
});

// 로그아웃
router.post("/logout", (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME);
  return res.json({ success: true });
});

// 로그인된 사용자 정보 조회
router.get("/me", (req, res) => {
  try {
    const token = req.cookies[process.env.COOKIE_NAME];
    if (!token) return res.json({ user: null });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ user: decoded });
  } catch {
    return res.json({ user: null });
  }
});

export default router;