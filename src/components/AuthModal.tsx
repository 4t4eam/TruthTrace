import { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import * as authService from '../lib/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (name: string, email: string) => void;
}

export function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLoginMode) {
        const res = await authService.login(email, password);
        onLoginSuccess(res.name, res.email);
        onClose();
      } else {
        await authService.signup(name, email, password);
        setIsLoginMode(true);
        alert('회원가입이 완료되었습니다! 로그인해주세요.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || '오류가 발생했습니다.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div
        className="relative bg-white dark:bg-black w-full max-w-md animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-12 py-12">
          <div className="mb-10">
            <h2 className="text-4xl text-gray-900 dark:text-white mb-3 tracking-tight">
              {isLoginMode ? t('auth.login') : t('auth.signup')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {isLoginMode ? t('auth.login.subtitle') : t('auth.signup.subtitle')}
            </p>
          </div>

          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLoginMode && (
              <div>
                <label className="block text-sm text-gray-900 dark:text-white mb-2">
                  {t('auth.fullname')}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-0 py-3 bg-transparent border-0 border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:border-gray-900 dark:focus:border-white text-gray-900 dark:text-white"
                  placeholder={t('auth.fullname.placeholder')}
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-900 dark:text-white mb-2">
                {t('auth.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-0 py-3 bg-transparent border-0 border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:border-gray-900 dark:focus:border-white text-gray-900 dark:text-white"
                placeholder={t('auth.email.placeholder')}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-900 dark:text-white mb-2">
                {t('auth.password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-0 py-3 bg-transparent border-0 border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:border-gray-900 dark:focus:border-white text-gray-900 dark:text-white"
                  placeholder={t('auth.password.placeholder')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors mt-8 tracking-wide"
            >
              {isLoginMode ? t('auth.continue') : t('auth.create')}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isLoginMode ? (
                <>
                  {t('auth.no.account')}{' '}
                  <button
                    onClick={() => setIsLoginMode(false)}
                    className="text-gray-900 dark:text-white underline hover:no-underline"
                  >
                    {t('auth.signup.link')}
                  </button>
                </>
              ) : (
                <>
                  {t('auth.have.account')}{' '}
                  <button
                    onClick={() => setIsLoginMode(true)}
                    className="text-gray-900 dark:text-white underline hover:no-underline"
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
