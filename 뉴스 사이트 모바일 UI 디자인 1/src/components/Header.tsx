import { User } from 'lucide-react';
import { CountrySelector } from './CountrySelector';
import { HamburgerButton } from './HamburgerButton';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HeaderProps {
  onMenuClick: () => void;
  isLoggedIn: boolean;
  userImage?: string;
  selectedCountry: string;
  onCountrySelect: (country: string) => void;
  onLoginClick: () => void;
  userName?: string;
  isMenuOpen?: boolean;
  onProfileClick?: () => void;
  isFactoOpen?: boolean;
  onFactoClose?: () => void;
}

export function Header({ onMenuClick, isLoggedIn, userImage, selectedCountry, onCountrySelect, onLoginClick, userName, isMenuOpen = false, onProfileClick, isFactoOpen = false, onFactoClose }: HeaderProps) {
  const { t } = useLanguage();
  const [showBackButton, setShowBackButton] = useState(false);
  
  useEffect(() => {
    if (isFactoOpen) {
      // 모달이 열릴 때 약간 지연 후 버튼 전환 (모달 슬라이드 애니메이션 완료 후)
      const timer = setTimeout(() => {
        setShowBackButton(true);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      // 모달이 닫힐 때 즉시 버튼 전환
      setShowBackButton(false);
    }
  }, [isFactoOpen]);
  
  return (
    <>
      <header className="bg-white dark:bg-black sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* 상단 바 */}
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* 왼쪽: 햄버거 메뉴 또는 뒤로가기 버튼 - 크로스페이드 애니메이션 */}
            <div className="relative w-10 h-10">
              {/* 뒤로가기 버튼 */}
              <button
                onClick={onFactoClose}
                className={`absolute inset-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md transition-all duration-300 ${
                  showBackButton ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'
                }`}
                aria-label="Back"
                tabIndex={showBackButton ? 0 : -1}
              >
                <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-gray-100" />
              </button>
              
              {/* 햄버거 버튼 */}
              <div
                className={`absolute inset-0 transition-all duration-300 ${
                  showBackButton ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100 pointer-events-auto'
                }`}
              >
                <HamburgerButton isOpen={isMenuOpen} onClick={onMenuClick} />
              </div>
            </div>

            {/* 중앙: 브랜드 로고 - 항상 "The Times" */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-2xl sm:text-3xl text-gray-900 dark:text-white tracking-tight cursor-pointer" style={{ fontFamily: 'Georgia, serif' }}>
                The Times
              </h1>
            </div>

            {/* 오른쪽: 국가 + 프로필/로그인 */}
            <div className="flex items-center gap-3">
              {/* Facto 모달이 열리면 국가 선택 숨김 */}
              {!isFactoOpen && (
                <CountrySelector 
                  selectedCountry={selectedCountry}
                  onCountrySelect={onCountrySelect}
                />
              )}
              
              {isLoggedIn ? (
                <button 
                  onClick={onProfileClick}
                  className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                  aria-label="프로필"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                    {userImage ? (
                      <img src={userImage} alt="프로필" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </div>
                    )}
                  </div>
                </button>
              ) : (
                <button 
                  onClick={onLoginClick}
                  className="text-sm px-5 py-2 bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors tracking-wide"
                >
                  {t('header.login')}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* 상단바 밑 경계선 - 사이드바보다 낮은 레이어 */}
      <div className="sticky top-[56px] sm:top-[64px] h-0 border-b border-gray-200 dark:border-gray-800 z-30" />
    </>
  );
}