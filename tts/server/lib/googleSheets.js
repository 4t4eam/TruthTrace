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

export async function getUsers() {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'Users!A:C'
  });
  return res.data.values || [];
}

export async function addUser({ name, email, passwordHash }) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: 'Users!A:C',
    valueInputOption: 'RAW',
    requestBody: { values: [[name, email, passwordHash]] }
  });
}

export async function updateUserField(rowIndex, colIndex, newValue) {
  const range = `Users!${String.fromCharCode(65 + colIndex)}${rowIndex + 1}`;

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[newValue]]
    }
  });
}
