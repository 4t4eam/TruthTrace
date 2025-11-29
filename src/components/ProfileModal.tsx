import { X, User, Mail, MapPin, Bell, Moon, LogOut, Globe } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  userImage?: string;
  onLogout: () => void;
}

export function ProfileModal({ isOpen, onClose, userName, userEmail, userImage, onLogout }: ProfileModalProps) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { code: 'en' as const, name: 'English' },
    { code: 'ko' as const, name: '한국어' },
    { code: 'zh' as const, name: '中文' },
    { code: 'ja' as const, name: '日本語' },
  ];

  const currentLanguageName = languages.find(lang => lang.code === language)?.name || 'English';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 오버레이 */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* 모달 컨텐츠 */}
      <div 
        className="relative bg-white dark:bg-black w-full max-w-md animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-12 py-12">
          {/* 프로필 헤더 */}
          <div className="mb-10 pb-10 border-b border-gray-200 dark:border-gray-800">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-900 mb-4">
              {userImage ? (
                <img src={userImage} alt="프로필" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-400 dark:text-gray-600" />
                </div>
              )}
            </div>
            <h2 className="text-3xl text-gray-900 dark:text-white mb-1 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
              {userName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{userEmail}</p>
          </div>

          {/* 설정 옵션 */}
          <div className="space-y-6 mb-10">
            {/* 국가 설정 */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-900">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-900 dark:text-white tracking-wide">{t('profile.country')}</span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{t('country.us')}</span>
            </div>

            {/* 언어 설정 */}
            <div className="relative">
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-900">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-900 dark:text-white tracking-wide">{t('profile.language')}</span>
                </div>
                <button
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {currentLanguageName}
                </button>
              </div>

              {/* 언어 드롭다운 */}
              {isLanguageOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsLanguageOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-lg z-50 rounded-sm">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLanguageOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          language === lang.code
                            ? 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* 알림 설정 */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-900">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-900 dark:text-white tracking-wide">{t('profile.notifications')}</span>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  notifications ? 'bg-gray-900 dark:bg-white' : 'bg-gray-300 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white dark:bg-black rounded-full transition-transform duration-200 ${
                    notifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 다크모드 */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-900">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-900 dark:text-white tracking-wide">{t('profile.darkmode')}</span>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  darkMode ? 'bg-gray-900 dark:bg-white' : 'bg-gray-300 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white dark:bg-black rounded-full transition-transform duration-200 ${
                    darkMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 로그아웃 버튼 */}
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full py-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white transition-colors flex items-center justify-center gap-2 tracking-wide"
          >
            <LogOut className="w-4 h-4" />
            {t('profile.logout')}
          </button>
        </div>
      </div>
    </div>
  );
}