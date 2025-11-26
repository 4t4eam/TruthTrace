import { NextRequest, NextResponse } from "next/server";
import { saveChatLog, getUserChatLogs } from "@/lib/googleSheets";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const messages = await getUserChatLogs(userId);
  return NextResponse.json({ messages });
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role, content } = await req.json();
  await saveChatLog(userId, role, content);
  return NextResponse.json({ ok: true });
}
