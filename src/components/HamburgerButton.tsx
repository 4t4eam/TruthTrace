interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export function HamburgerButton({ isOpen, onClick }: HamburgerButtonProps) {
  return (
    <button
      onClick={onClick}
      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md transition-all duration-200 hover:scale-110"
      aria-label={isOpen ? '닫기' : '메뉴'}
    >
      <div className="w-5 h-5 flex flex-col justify-center items-center relative">
        {/* 상단 라인 */}
        <span
          className={`w-5 h-0.5 bg-gray-900 dark:bg-gray-100 absolute transition-all duration-300 ease-in-out ${
            isOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'
          }`}
        />
        {/* 중간 라인 */}
        <span
          className={`w-5 h-0.5 bg-gray-900 dark:bg-gray-100 absolute transition-all duration-300 ease-in-out ${
            isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
          }`}
        />
        {/* 하단 라인 */}
        <span
          className={`w-5 h-0.5 bg-gray-900 dark:bg-gray-100 absolute transition-all duration-300 ease-in-out ${
            isOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'
          }`}
        />
      </div>
    </button>
  );
}
