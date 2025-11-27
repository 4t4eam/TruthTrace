import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CategoryBar } from './components/CategoryBar';
import { NewsCard } from './components/NewsCard';
import { SideMenu } from './components/SideMenu';
import { NewsDetailModal } from './components/NewsDetailModal';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { Footer } from './components/Footer';
import { useDarkMode } from './hooks/useDarkMode';
import { NewsService, NewsItem } from './lib/newsService';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

function AppContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedCountry, setSelectedCountry] = useState('South Korea');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userImage, setUserImage] = useState('');
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [recommendedNews, setRecommendedNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // 다크모드 자동 인식
  useDarkMode();
  
  // 언어 컨텍스트 사용
  const { language, t } = useLanguage();

  const categories = ['전체', '정치', '경제', '사회', '기술', '엔터'];

  // 뉴스 데이터 로드 - 언어가 변경될 때도 리로드
  useEffect(() => {
    loadNews();
  }, [selectedCategory, selectedCountry, language]);

  const loadNews = async () => {
    setIsLoading(true);
    try {
      const news = await NewsService.getNewsByCategoryAndCountry(selectedCategory, selectedCountry, language);
      setNewsItems(news);
    } catch (error) {
      console.error('뉴스 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 뉴스 클릭 핸들러
  const handleNewsClick = async (news: NewsItem) => {
    setSelectedNews(news);
    // 추천 뉴스 로드 - 같은 언어의 기사만
    const recommended = await NewsService.getRecommendedNews(news.id, news.category, language);
    setRecommendedNews(recommended);
  };

  // 로그인 핸들러
  const handleLogin = (email: string, password: string) => {
    // 임시 로그인 로직
    setIsLoggedIn(true);
    setUserEmail(email);
    setUserName(email.split('@')[0]); // 이메일에서 이름 추출
    setUserImage('https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9maWxlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYzOTcyNTY2fDA&ixlib=rb-4.1.0&q=80&w=1080');
    setIsAuthModalOpen(false);
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setUserEmail('');
    setUserImage('');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      {/* 헤더 */}
      <Header 
        onMenuClick={() => setIsMenuOpen(!isMenuOpen)}
        isLoggedIn={isLoggedIn}
        selectedCountry={selectedCountry}
        onCountrySelect={setSelectedCountry}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onProfileClick={() => setIsProfileModalOpen(true)}
        userName={userName}
        userImage={userImage}
        isMenuOpen={isMenuOpen}
      />

      {/* 카테고리 바 */}
      <CategoryBar 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />

      {/* 뉴스 목록 */}
      <main className="flex-1 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-500 dark:text-gray-400">{t('news.loading')}</div>
          </div>
        ) : newsItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {newsItems.map(item => (
              <NewsCard 
                key={item.id} 
                {...item} 
                onClick={() => handleNewsClick(item)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">
            <p>{t('news.no.articles')}</p>
          </div>
        )}
      </main>

      {/* 푸터 */}
      <Footer />

      {/* 사이드 메뉴 */}
      <SideMenu 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      {/* 로그인/회원가입 모달 */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />

      {/* 프로필 설정 모달 */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userName={userName}
        userEmail={userEmail}
        userImage={userImage}
        onLogout={handleLogout}
      />

      {/* 뉴스 상세 모달 */}
      {selectedNews && (
        <NewsDetailModal
          news={selectedNews}
          onClose={() => setSelectedNews(null)}
          recommendedNews={recommendedNews}
        />
      )}
    </div>
  );
}