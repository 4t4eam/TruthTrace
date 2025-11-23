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

    // 기존 사용자 조회
    const read = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      range: SHEET_RANGE,
    });

    const rows = read.data.values || [];

    const exists = rows.find((row) => row[0] === email);
    if (exists) {
      return NextResponse.json({ error: "이미 존재하는 이메일입니다." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // 새 데이터 추가
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      range: SHEET_RANGE,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[email, passwordHash, new Date().toISOString()]],
      },
    });

    return NextResponse.json({ message: "회원가입 성공" });
  } catch (e) {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }

}
