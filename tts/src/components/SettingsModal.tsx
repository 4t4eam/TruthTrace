import { ArrowLeft, User, Mail, Lock, Camera } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  userImage?: string;
  onSave: (data: { name: string; email: string; password?: string; image?: string }) => void;
}

export function SettingsModal({ isOpen, onClose, userName, userEmail, userImage, onSave }: SettingsModalProps) {
  const { t } = useLanguage();
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  
  // 폼 상태
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState(userImage || '');
  const [imagePreview, setImagePreview] = useState(userImage || '');

  // 열림/닫힘 애니메이션
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
      // 초기값 설정
      setName(userName);
      setEmail(userEmail);
      setProfileImage(userImage || '');
      setImagePreview(userImage || '');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, userName, userEmail, userImage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setProfileImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 비밀번호 변경 시 확인
    if (newPassword && newPassword !== confirmPassword) {
      alert(t('settings.passwordMismatch') || '비밀번호가 일치하지 않습니다.');
      return;
    }

    const data: { name: string; email: string; password?: string; image?: string } = {
      name,
      email,
      image: profileImage,
    };

    // 새 비밀번호가 있으면 추가
    if (newPassword) {
      data.password = newPassword;
    }

    onSave(data);
    onClose();
  };

  if (!shouldRender) return null;

  return (
    <>
      {/* 오버레이 */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-500 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* 전체화면 모달 - 슬라이드 인 애니메이션 */}
      <div 
        className={`fixed inset-0 z-[100] bg-white dark:bg-black transform transition-transform duration-500 ease-out ${
          isAnimating ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div onClick={(e) => e.stopPropagation()}>
          {/* 커스텀 헤더 */}
          <header className="bg-white dark:bg-black sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-14 sm:h-16">
                {/* 뒤로가기 버튼 - 헤더 햄버거 버튼 위치와 일치 */}
                <div className="w-10 h-10">
                  <button
                    onClick={onClose}
                    className="w-10 h-10 p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md transition-colors"
                    aria-label="뒤로가기"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                  </button>
                </div>

                {/* 제목 - 중앙 정렬 */}
                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <h1 className="text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                    {t('settings.title') || '설정'}
                  </h1>
                </div>

                {/* 빈 공간 - 레이아웃 유지 */}
                <div className="w-auto"></div>
              </div>
            </div>
          </header>

          {/* 본문 - fade in 애니메이션 */}
          <div 
            className={`max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-opacity duration-700 delay-200 ${
              isAnimating ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* 프로필 사진 */}
              <div className="pb-10 border-b border-gray-200 dark:border-gray-800">
                <label className="block mb-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400 tracking-wide">
                    {t('settings.profileImage') || '프로필 사진'}
                  </span>
                </label>
                
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800">
                    {imagePreview ? (
                      <img src={imagePreview} alt="프로필" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                      </div>
                    )}
                  </div>
                  
                  <label className="cursor-pointer px-5 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors flex items-center gap-2 tracking-wide">
                    <Camera className="w-4 h-4" />
                    <span className="text-sm">{t('settings.changeImage') || '사진 변경'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* 이름 */}
              <div className="pb-10 border-b border-gray-200 dark:border-gray-800">
                <label htmlFor="name" className="block mb-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400 tracking-wide">
                    {t('settings.name') || '이름'}
                  </span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors"
                    placeholder={t('settings.namePlaceholder') || '이름을 입력하세요'}
                  />
                </div>
              </div>

              {/* 이메일 */}
              <div className="pb-10 border-b border-gray-200 dark:border-gray-800">
                <label htmlFor="email" className="block mb-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400 tracking-wide">
                    {t('settings.email') || '이메일'}
                  </span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors"
                    placeholder={t('settings.emailPlaceholder') || '이메일을 입력하세요'}
                  />
                </div>
              </div>

              {/* 비밀번호 변경 */}
              <div className="pb-10 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-lg text-gray-900 dark:text-white mb-6 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                  {t('settings.changePassword') || '비밀번호 변경'}
                </h3>
                
                <div className="space-y-6">
                  {/* 현재 비밀번호 */}
                  <div>
                    <label htmlFor="currentPassword" className="block mb-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400 tracking-wide">
                        {t('settings.currentPassword') || '현재 비밀번호'}
                      </span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {/* 새 비밀번호 */}
                  <div>
                    <label htmlFor="newPassword" className="block mb-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400 tracking-wide">
                        {t('settings.newPassword') || '새 비밀번호'}
                      </span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {/* 비밀번호 확인 */}
                  <div>
                    <label htmlFor="confirmPassword" className="block mb-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400 tracking-wide">
                        {t('settings.confirmPassword') || '비밀번호 확인'}
                      </span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  {t('settings.passwordHelp') || '비밀번호를 변경하지 않으려면 비워두세요.'}
                </p>
              </div>

              {/* 저장 버튼 - 비밀번호 확인란 아래 */}
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors tracking-wide"
                >
                  {t('settings.save') || '저장'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
