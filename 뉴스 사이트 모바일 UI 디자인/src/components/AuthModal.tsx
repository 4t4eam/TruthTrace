import { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
}

export function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginMode) {
      onLogin(email, password);
      onClose();
    } else {
      // 회원가입 로직 (임시)
      alert('회원가입이 완료되었습니다!');
      setIsLoginMode(true);
    }
  };

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
          {/* 제목 */}
          <div className="mb-10">
            <h2 className="text-4xl text-gray-900 dark:text-white mb-3 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
              {isLoginMode ? t('auth.login') : t('auth.signup')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {isLoginMode ? t('auth.login.subtitle') : t('auth.signup.subtitle')}
            </p>
          </div>

          {/* 폼 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 이름 (회원가입) */}
            {!isLoginMode && (
              <div>
                <label className="block text-sm text-gray-900 dark:text-white mb-2 tracking-wide">
                  {t('auth.fullname')}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-0 py-3 bg-transparent border-0 border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:border-gray-900 dark:focus:border-white text-gray-900 dark:text-white transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  placeholder={t('auth.fullname.placeholder')}
                  required
                />
              </div>
            )}

            {/* 이메일 */}
            <div>
              <label className="block text-sm text-gray-900 dark:text-white mb-2 tracking-wide">
                {t('auth.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-0 py-3 bg-transparent border-0 border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:border-gray-900 dark:focus:border-white text-gray-900 dark:text-white transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-600"
                placeholder={t('auth.email.placeholder')}
                required
              />
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-sm text-gray-900 dark:text-white mb-2 tracking-wide">
                {t('auth.password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-0 py-3 bg-transparent border-0 border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:border-gray-900 dark:focus:border-white text-gray-900 dark:text-white transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  placeholder={t('auth.password.placeholder')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors mt-8 tracking-wide"
            >
              {isLoginMode ? t('auth.continue') : t('auth.create')}
            </button>
          </form>

          {/* 전환 버튼 */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isLoginMode ? (
                <>
                  {t('auth.no.account')}{' '}
                  <button
                    onClick={() => setIsLoginMode(!isLoginMode)}
                    className="text-gray-900 dark:text-white underline hover:no-underline transition-all"
                  >
                    {t('auth.signup.link')}
                  </button>
                </>
              ) : (
                <>
                  {t('auth.have.account')}{' '}
                  <button
                    onClick={() => setIsLoginMode(!isLoginMode)}
                    className="text-gray-900 dark:text-white underline hover:no-underline transition-all"
                  >
                    {t('auth.login.link')}
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}