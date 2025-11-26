// lib/googleSheets.ts
import { google } from "googleapis";

export async function getSheet() {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    undefined,
    process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/spreadsheets"]
  );
  const sheets = google.sheets({ version: "v4", auth });
  return sheets;
}

// 회원 정보 시트
export const SHEET_RANGE = "Users!A:D"; // userId, email, passwordHash, createdAt
// 채팅 로그 시트
export const CHAT_RANGE = "ChatLog!A:D"; // userId, role, content, createdAt

export async function getUserChatLogs(userId: string) {
  const sheets = await getSheet();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!spreadsheetId) throw new Error("Missing environment variable: GOOGLE_SHEETS_ID");

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: CHAT_RANGE,
  });

  const rows = res.data.values || [];
  return rows
    .filter(row => row[0] === userId)
    .map(row => ({ role: row[1], content: row[2], createdAt: row[3] }));
}

export async function saveChatLog(userId: string, role: string, content: string) {
  const sheets = await getSheet();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!spreadsheetId) throw new Error("Missing environment variable: GOOGLE_SHEETS_ID");

  const timestamp = new Date().toISOString();
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: CHAT_RANGE,
    valueInputOption: "RAW",
    requestBody: {
      values: [[userId, role, content, timestamp]],
    },
  });
}
