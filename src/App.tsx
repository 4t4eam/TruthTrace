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
  const [error, setError] = useState('');

  useDarkMode();
  const { language, t } = useLanguage();
  const categories = ['전체', '정치', '경제', '사회', '기술', '엔터'];

  useEffect(() => {
    loadNews();
  }, [selectedCategory, selectedCountry, language]);

  const loadNews = async () => {
    setIsLoading(true);
    try {
      const news = await NewsService.getNewsByCategoryAndCountry(selectedCategory, selectedCountry, language);
      setNewsItems(news);
    } catch (err) {
      console.error('뉴스 로드 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewsClick = async (news: NewsItem) => {
    setSelectedNews(news);
    const recommended = await NewsService.getRecommendedNews(news.id, news.category, language);
    setRecommendedNews(recommended);
  };

  // 서버와 연동된 회원가입
  const handleSignup = async (email: string, password: string, name: string) => {
    setError('');
    try {
      const res = await fetch('http://localhost:4000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || '회원가입 실패');
        return;
      }
      alert('회원가입이 완료되었습니다.');
    } catch {
      setError('서버와 통신할 수 없습니다.');
    }
  };

  // 서버와 연동된 로그인
  const handleLogin = async (email: string, password: string) => {
    setError('');
    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || '로그인 실패');
        return;
      }
      setIsLoggedIn(true);
      setUserEmail(data.email);
      setUserName(data.name);
      setUserImage('https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9maWxlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYzOTcyNTY2fDA&ixlib=rb-4.1.0&q=80&w=1080');
      setIsAuthModalOpen(false);
    } catch {
      setError('서버와 통신할 수 없습니다.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setUserEmail('');
    setUserImage('');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
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
      <CategoryBar 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      <main className="flex-1 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-500 dark:text-gray-400">{t('news.loading')}</div>
          </div>
        ) : newsItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {newsItems.map(item => (
              <NewsCard key={item.id} {...item} onClick={() => handleNewsClick(item)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">
            <p>{t('news.no.articles')}</p>
          </div>
        )}
      </main>
      <Footer />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userName={userName}
        userEmail={userEmail}
        userImage={userImage}
        onLogout={handleLogout}
      />
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
