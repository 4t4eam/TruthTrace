"use client";

import { useState } from "react";
import BottomNav from '@/components/BottomNav'
import LogoutButton from "@/components/LogoutButton";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok && data.token) {
        // 로그인 성공 시 localStorage에 토큰 저장
        localStorage.setItem("token", data.token);
        setMessage("로그인 성공!");
      } else {
        setMessage(data.error || "로그인 실패");
      }
    } catch (err) {
      console.error(err);
      setMessage("서버 오류");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg">
      <h1 className="text-2xl font-bold mb-4">로그인</h1>

      <input
        type="email"
        placeholder="이메일"
        className="w-full border p-2 rounded mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="비밀번호"
        className="w-full border p-2 rounded mb-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white p-2 rounded mt-2"
      >
        로그인
      </button>

      <LogoutButton />

      {message && <p className="mt-4 text-center">{message}</p>}
      <BottomNav />
    </div>
  );
}
