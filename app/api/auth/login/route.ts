import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSheet, SHEET_RANGE } from "@/lib/googleSheets";

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
    const user = rows.find((row) => row[0] === email);

    if (!user) return NextResponse.json({ error: "등록되지 않은 이메일입니다." }, { status: 400 });

    const passwordMatch = await bcrypt.compare(password, user[1]);
    if (!passwordMatch) {
      return NextResponse.json({ error: "비밀번호가 일치하지 않습니다." }, { status: 400 });
    }

    // 실제 서비스라면 JWT 발급
    return NextResponse.json({ message: "로그인 성공" });
  } catch (e) {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}