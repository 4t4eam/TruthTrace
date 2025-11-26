import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSheet, SHEET_RANGE } from "@/lib/googleSheets";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "필드를 모두 입력하세요." }, { status: 400 });
    }

    const sheets = await getSheet();

    const read = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      range: SHEET_RANGE,
    });

    const rows = read.data.values || [];
    const user = rows.find((row) => row[1] === email); // email은 1번 컬럼
    if (!user) return NextResponse.json({ error: "등록되지 않은 이메일입니다." }, { status: 400 });

    const passwordMatch = await bcrypt.compare(password, user[2]);
    if (!passwordMatch) {
      return NextResponse.json({ error: "비밀번호가 일치하지 않습니다." }, { status: 400 });
    }

    // JWT 발급 (간단 예시, 배포 시 secret 관리 필요)
    const token = jwt.sign(
      { userId: user[0], email: user[1] },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return NextResponse.json({ message: "로그인 성공", token, userId: user[0] });
  } catch (e) {
    console.error("LOGIN ERROR:", e);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
