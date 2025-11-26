"use client";

import { useState } from "react";
import BottomNav from '@/components/BottomNav'

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setMessage(data.error || data.message);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg">
      <h1 className="text-2xl font-bold mb-4">회원가입</h1>

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
        onClick={handleRegister}
        className="w-full bg-blue-600 text-white p-2 rounded mt-2"
      >
        회원가입
      </button>

      {message && <p className="mt-4 text-center">{message}</p>}
      <BottomNav />
    </div>
  );
}
