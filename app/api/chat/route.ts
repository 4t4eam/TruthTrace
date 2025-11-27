import { NextRequest, NextResponse } from "next/server";
import { saveChatLog, getUserChatLogs } from "@/lib/googleSheets";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sessionId = req.nextUrl.searchParams.get("sessionId");
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  try {
    const messages = await getUserChatLogs(userId, sessionId);
    return NextResponse.json({ messages });
  } catch (e) {
    console.error("GET /api/chat error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { role, content, sessionId: providedSessionId } = body;

    if (!role || !content) {
      return NextResponse.json({ error: "role and content required" }, { status: 400 });
    }

    // sessionId가 제공되지 않으면 새로 생성
    const sessionId = providedSessionId || `${userId}-${Date.now()}`;

    await saveChatLog(userId, role, content, sessionId);

    return NextResponse.json({ ok: true, sessionId });
  } catch (e) {
    console.error("POST /api/chat error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
