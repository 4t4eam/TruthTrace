import BottomNav from '@/components/BottomNav'

export default function SearchPage() {
  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-gradient-to-b from-blue-50 to-white">
      {/* 헤더 */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
        <h1 className="text-xl font-bold text-center">🔍 검색</h1>
        <p className="text-xs text-center text-blue-100 mt-1">정보를 검색하세요</p>
      </header>

      {/* 콘텐츠 영역 */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="bg-white rounded-2xl p-10 shadow-md">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-lg font-bold text-gray-700">검색 페이지</p>
            <p className="text-sm text-gray-400 mt-2">준비 중입니다</p>
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <BottomNav />
    </div>
  )
}