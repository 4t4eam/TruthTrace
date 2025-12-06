import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CategoryBar } from './components/CategoryBar';
import { NewsCard } from './components/NewsCard';
import { SideMenu } from './components/SideMenu';
import { NewsDetailModal } from './components/NewsDetailModal';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { FactoHistoryModal } from './components/FactoHistoryModal';
import { Footer } from './components/Footer';
import { useDarkMode } from './hooks/useDarkMode';
import { NewsService, NewsItem } from './lib/newsService';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { FactoModal } from './components/FactoModal';
import { FactoHistoryItem, FactoHistoryService } from './lib/factoHistoryService';

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
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userImage, setUserImage] = useState('');
  const [userId, setUserId] = useState('');
  const [factoHistory, setFactoHistory] = useState<FactoHistoryItem[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [recommendedNews, setRecommendedNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isFactoModalOpen, setIsFactoModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

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
  const handleLogin = async (name: string, email: string) => {
    setIsLoggedIn(true);
    setUserId(email);
    setUserName(name);
    setUserEmail(email);
    setUserImage('https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?...');

    try {
      // setUserId는 비동기이므로 userId 대신 email 사용
      const history = await FactoHistoryService.getHistory(email);
      console.log(history);
      setFactoHistory(history);
    } catch (err) {
      console.error("히스토리 로드 실패:", err);
    }

    setIsAuthModalOpen(false);
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId('');
    setUserName('');
    setUserEmail('');
    setUserImage('');
    setFactoHistory([]);
  };

  // Facto 히스토리 추가 핸들러
  const handleAddFactoHistory = (item: FactoHistoryItem) => {
    setFactoHistory(prev => [item, ...prev]);
  };

  // Facto 히스토리 삭제 핸들러
  const handleDeleteFactoHistory = (historyId: string) => {
    setFactoHistory(prev => prev.filter(item => item.id !== historyId));
  };

  // Facto 히스토리 전체 삭제 핸들러
  const handleClearFactoHistory = () => {
    setFactoHistory([]);
  };

  // 설정 저장 핸들러
  const handleSaveSettings = (data: { name: string; email: string; password?: string; image?: string }) => {
    setUserName(data.name);
    setUserEmail(data.email);
    if (data.image) {
      setUserImage(data.image);
    }
    // 비밀번호는 실제 백엔드 연동 시 처리
    console.log('Settings saved:', data);
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
        isFactoOpen={isFactoModalOpen}
        onFactoClose={() => setIsFactoModalOpen(false)}
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
        onFactoOpen={() => setIsFactoModalOpen(true)}
        onSettingsOpen={() => setIsSettingsModalOpen(true)}
        onHistoryOpen={() => setIsHistoryModalOpen(true)}
        isLoggedIn={isLoggedIn}
      />

      {/* 로그인/회원가입 모달 */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLogin}
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

      {/* 설정 모달 */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        userName={userName}
        userEmail={userEmail}
        userImage={userImage}
        onSave={handleSaveSettings}
      />

      {/* Facto 히스토리 모달 */}
      <FactoHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        factoHistory={factoHistory}
        onDeleteHistory={handleDeleteFactoHistory}
        onClearHistory={handleClearFactoHistory}
      />

      {/* 뉴스 상세 모달 */}
      {selectedNews && (
        <NewsDetailModal
          news={selectedNews}
          onClose={() => setSelectedNews(null)}
          recommendedNews={recommendedNews}
        />
      )}

      {/* Facto 모달 */}
      <FactoModal 
        isOpen={isFactoModalOpen} 
        onClose={() => setIsFactoModalOpen(false)}
        userId={userId}
        onHistoryAdd={handleAddFactoHistory}
      />
    </div>
  );
}
