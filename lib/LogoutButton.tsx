"use client";

export default function LogoutButton() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // 로그아웃 후 로그인 페이지로 이동
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full bg-red-500 text-white p-2 rounded mt-4"
    >
      로그아웃
    </button>
  );
}
