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
export const SHEET_RANGE = "Users!A:D"; // userId(uuid), email, passwordHash, createdAt
// 채팅 로그 시트 (A:E) -> A: userId, B: role, C: content, D: createdAt, E: sessionId
export const CHAT_RANGE = "ChatLog!A:E";

export async function getUserChatLogs(userId: string, sessionId?: string) {
  const sheets = await getSheet();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!spreadsheetId) throw new Error("Missing environment variable: GOOGLE_SHEETS_ID");

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: CHAT_RANGE,
  });

  const rows = res.data.values || [];
  let filtered = rows.filter((row) => row[0] === userId);
  if (sessionId) {
    filtered = filtered.filter((row) => row[4] === sessionId);
  }
  // map to messages
  return filtered.map((row) => ({
    role: row[1],
    content: row[2],
    createdAt: row[3],
    sessionId: row[4],
  }));
}

export async function saveChatLog(userId: string, role: string, content: string, sessionId: string) {
  const sheets = await getSheet();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!spreadsheetId) throw new Error("Missing environment variable: GOOGLE_SHEETS_ID");

  const timestamp = new Date().toISOString();
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: CHAT_RANGE,
    valueInputOption: "RAW",
    requestBody: {
      values: [[userId, role, content, timestamp, sessionId]],
    },
  });
}

/**
 * 세션 목록을 반환합니다.
 * 반환 형태: [{ sessionId, lastAt, lastContent, messageCount }]
 */
export async function getUserSessions(userId: string) {
  const sheets = await getSheet();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!spreadsheetId) throw new Error("Missing environment variable: GOOGLE_SHEETS_ID");

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: CHAT_RANGE,
  });

  const rows = res.data.values || [];
  const userRows = rows.filter((r) => r[0] === userId && r[4]); // ensure sessionId exists

  const map = new Map<string, { sessionId: string; lastAt: string; lastContent: string; count: number }>();

  for (const row of userRows) {
    const sessionId = row[4];
    const createdAt = row[3] || "";
    const content = row[2] || "";
    if (!map.has(sessionId)) {
      map.set(sessionId, { sessionId, lastAt: createdAt, lastContent: content, count: 1 });
    } else {
      const cur = map.get(sessionId)!;
      cur.count += 1;
      if (!cur.lastAt || (createdAt && new Date(createdAt) > new Date(cur.lastAt))) {
        cur.lastAt = createdAt;
        cur.lastContent = content;
      }
      map.set(sessionId, cur);
    }
  }

  const sessions = Array.from(map.values()).sort((a, b) => {
    const da = a.lastAt ? new Date(a.lastAt).getTime() : 0;
    const db = b.lastAt ? new Date(b.lastAt).getTime() : 0;
    return db - da;
  });

  return sessions;
}

export async function deleteUserSession(userId: string, sessionId: string) {
  const sheets = await getSheet();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!spreadsheetId) throw new Error("Missing environment variable");

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: CHAT_RANGE,
  });

  const rows = res.data.values || [];

  // 삭제하지 않을 row들만 남기기
  const filtered = rows.filter(
    (row) => !(row[0] === userId && row[4] === sessionId)
  );

  // 전체 ChatLog 시트를 새로운 rows로 덮어쓰기
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: CHAT_RANGE,
    valueInputOption: "RAW",
    requestBody: { values: filtered },
  });
}
