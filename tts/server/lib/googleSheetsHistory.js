import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const auth = new google.auth.JWT(
  process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
  null,
  process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/spreadsheets']
);

const sheets = google.sheets({ version: 'v4', auth });
const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const RANGE = 'FactoHistory!A:E';

export async function getAllHistory() {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: RANGE
  });

  const rows = res.data.values || [];
  if (rows.length < 1) return [];
  console.log(rows);

  return rows.map(row => {
    let parsedResult = {};
    
    try {
      parsedResult = row[3] ? JSON.parse(row[3]) : {};
    } catch {
      parsedResult = {};
    }

    return {
      id: row[0],
      userId: row[1],
      inputText: row[2],
      result: parsedResult,
      createdAt: new Date(row[4])
    };
  });
}

export async function addHistory(item) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: RANGE,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[
        item.id,
        item.userId,
        item.inputText,
        JSON.stringify(item.result),
        item.createdAt.toISOString()
      ]]
    }
  });
}

export async function deleteHistory(userId, historyId) {
  const rows = await getAllHistory();

  const targetIndex = rows.findIndex(r => r.id === historyId && r.userId === userId);
  if (targetIndex === -1) return;

  const rowNumber = targetIndex + 2; // header 제외

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: 0, // FactoHistory 시트의 ID (스프레드시트에서 확인)
              dimension: 'ROWS',
              startIndex: rowNumber - 1,
              endIndex: rowNumber
            }
          }
        }
      ]
    }
  });
}

export async function clearHistory(userId) {
  const rows = await getAllHistory();
  const deleteRequests = [];

  rows.forEach((row, index) => {
    if (row.userId === userId) {
      const rowNumber = index + 2;
      deleteRequests.push({
        deleteDimension: {
          range: {
            sheetId: 0,
            dimension: 'ROWS',
            startIndex: rowNumber - 1,
            endIndex: rowNumber
          }
        }
      });
    }
  });

  if (deleteRequests.length === 0) return;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: {
      requests: deleteRequests
    }
  });
}
