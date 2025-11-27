import { X, Home, TrendingUp, Bookmark, Settings, HelpCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const { t } = useLanguage();
  
  const menuItems = [
    { icon: Home, label: t('menu.home'), href: '#' },
    { icon: TrendingUp, label: t('menu.trending'), href: '#' },
    { icon: Bookmark, label: t('menu.bookmarks'), href: '#' },
    { icon: Settings, label: t('menu.settings'), href: '#' },
  ];

  return (
    <>
      {/* 오버레이 */}
      <div 
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* 사이드 메뉴 - 상단바 아래에 위치 */}
      <aside 
        className={`fixed top-[56px] sm:top-[64px] left-0 h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] w-72 sm:w-80 bg-white dark:bg-black z-40 transform transition-all duration-500 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* 메뉴 아이템 - staggered animation */}
          <nav className="flex-1 p-6">
            <ul className="space-y-1">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li 
                    key={item.label}
                    className={`transition-all duration-300 ${
                      isOpen 
                        ? 'opacity-100 translate-x-0' 
                        : 'opacity-0 -translate-x-4'
                    }`}
                    style={{ 
                      transitionDelay: isOpen ? `${index * 50}ms` : '0ms' 
                    }}
                  >
                    <a 
                      href={item.href}
                      className="flex items-center gap-4 px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-200"
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}