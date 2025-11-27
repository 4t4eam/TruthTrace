'use client'
import React, { useEffect, useState } from "react";

interface SessionItem {
  sessionId: string;
  lastAt?: string;
  lastContent?: string;
  count?: number;
}

export default function ChatDrawer({
  open,
  onClose,
  onSelect,
  token,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (sessionId: string) => void;
  token: string | null;
}) {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    fetchSessions();
  }, [open]);

  const fetchSessions = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.userId;
      const res = await fetch("/api/chat/sessions", {
        headers: { "x-user-id": userId },
      });
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const createNewSession = async () => {
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.userId;
      const res = await fetch("/api/chat/sessions", {
        method: "POST",
        headers: { "x-user-id": userId },
      });
      const data = await res.json();
      if (data.sessionId) {
        onSelect(data.sessionId);
        onClose();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteSession = async (sessionId: string) => {
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.userId;
      const res = await fetch(`/api/chat/sessions?sessionId=${encodeURIComponent(sessionId)}`, {
        method: "DELETE",
        headers: { "x-user-id": userId },
      });
      if (res.ok) {
        fetchSessions();
        if (onSelect) onSelect(""); // 삭제 후 선택 초기화
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {/* overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity ${open ? "opacity-60 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ background: "rgba(0,0,0,0.6)", transition: "opacity 200ms" }}
        onClick={onClose}
      />
      {/* drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-80 max-w-[80%] bg-white shadow-xl transform transition-transform ${open ? "translate-x-0" : "-translate-x-full"}`}
        style={{ transition: "transform 220ms" }}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">내 채팅</h3>
            <button onClick={onClose} className="text-sm text-gray-500">닫기</button>
          </div>
          <p className="text-xs text-gray-400 mt-1">세션을 생성, 선택 또는 삭제할 수 있습니다</p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={createNewSession}
              className="flex-1 py-2 rounded-md bg-blue-600 text-white text-sm"
            >
              새 세션
            </button>
            <button
              onClick={fetchSessions}
              className="py-2 px-3 rounded-md border text-sm"
            >
              새로고침
            </button>
          </div>
        </div>

        <div className="p-3 overflow-auto h-full">
          {loading && <div className="text-sm text-gray-500">로딩 중...</div>}
          {!loading && sessions.length === 0 && (
            <div className="text-sm text-gray-400">세션이 없습니다. 새 세션을 만들어 시작하세요.</div>
          )}
          <ul className="space-y-2">
            {sessions.map((s) => (
              <li key={s.sessionId} className="flex justify-between items-center">
                <button
                  onClick={() => { onSelect(s.sessionId); onClose(); }}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-100 flex-1"
                >
                  <div className="text-sm font-medium break-words">{s.lastContent ? s.lastContent.slice(0, 60) : s.sessionId}</div>
                  <div className="text-xs text-gray-400 mt-1 flex justify-between">
                    <span>{s.count ?? 0}개 메시지</span>
                    <span>{s.lastAt ? new Date(s.lastAt).toLocaleString() : ""}</span>
                  </div>
                </button>
                <button
                  onClick={() => deleteSession(s.sessionId)}
                  className="ml-2 text-red-500 text-sm px-2 py-1 border rounded hover:bg-red-50"
                >삭제</button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}