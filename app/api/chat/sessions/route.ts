import { NextRequest, NextResponse } from "next/server";
import { getUserSessions, deleteUserSession } from "@/lib/googleSheets";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const sessions = await getUserSessions(userId);
    // sessions: [{ sessionId, lastAt, lastContent, count }]
    return NextResponse.json({ sessions });
  } catch (e) {
    console.error("GET /api/chat/sessions error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // 단순히 새 세션 id만 생성해 반환 (실제 메시지는 /api/chat POST로 저장)
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const sessionId = `${userId}-${Date.now()}`;
    // Note: 세션 메타(제목 등)를 저장하려면 별도 시트가 필요. 현재는 ID만 생성.
    return NextResponse.json({ ok: true, sessionId });
  } catch (e) {
    console.error("POST /api/chat/sessions error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sessionId = req.nextUrl.searchParams.get("sessionId");
  if (!sessionId)
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });

  try {
    await deleteUserSession(userId, sessionId);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/chat/sessions error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
