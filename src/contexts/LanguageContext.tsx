import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ko' | 'zh' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// 번역 데이터
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'header.brand': 'The Times',
    'header.login': 'Log In',
    
    // Categories
    'category.all': 'All',
    'category.politics': 'Politics',
    'category.economy': 'Economy',
    'category.society': 'Society',
    'category.technology': 'Technology',
    'category.sports': 'Sports',
    'category.entertainment': 'Entertainment',
    'category.world': 'World',
    'category.science': 'Science',
    
    // Auth Modal
    'auth.login': 'Log in',
    'auth.signup': 'Create account',
    'auth.login.subtitle': 'Continue to The Times',
    'auth.signup.subtitle': 'Start reading The Times today',
    'auth.fullname': 'Full Name',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.fullname.placeholder': 'Enter your name',
    'auth.email.placeholder': 'you@example.com',
    'auth.password.placeholder': 'Enter your password',
    'auth.continue': 'Continue',
    'auth.create': 'Create account',
    'auth.no.account': "Don't have an account?",
    'auth.have.account': 'Already have an account?',
    'auth.signup.link': 'Sign up',
    'auth.login.link': 'Log in',
    
    // Profile Modal
    'profile.country': 'Country',
    'profile.language': 'Language',
    'profile.notifications': 'Notifications',
    'profile.darkmode': 'Dark Mode',
    'profile.logout': 'Log out',
    
    // Countries
    'country.us': 'United States',
    'country.kr': 'South Korea',
    'country.cn': 'China',
    'country.jp': 'Japan',
    
    // Languages
    'language.en': 'English',
    'language.ko': '한국어',
    'language.zh': '中文',
    'language.ja': '日本語',
    
    // Side Menu
    'menu.home': 'Home',
    'menu.trending': 'Trending',
    'menu.bookmarks': 'Bookmarks',
    'menu.settings': 'Settings',
    
    // News
    'news.loading': 'Loading news...',
    'news.no.articles': 'No articles found in this category or country.',
    'news.recommended': 'Recommended Articles',
    'news.read.more': 'Read More',
    
    // Footer
    'footer.news': 'News',
    'footer.opinion': 'Opinion',
    'footer.more': 'More',
    'footer.subscribe': 'Subscribe',
    'footer.editorials': 'Editorials',
    'footer.columns': 'Columns',
    'footer.contributors': 'Contributors',
    'footer.letters': 'Letters',
    'footer.multimedia': 'Multimedia',
    'footer.photography': 'Photography',
    'footer.video': 'Video',
    'footer.newsletters': 'Newsletters',
    'footer.home.delivery': 'Home Delivery',
    'footer.digital': 'Digital Subscriptions',
    'footer.gift': 'Gift Subscriptions',
    'footer.group': 'Group Subscriptions',
    'footer.tagline': 'Independent journalism with integrity since 1851',
    'footer.newsletter.subscribe': 'Subscribe to Newsletter',
    'footer.contact': 'Contact Us',
    'footer.about': 'About Us',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.help': 'Help Center',
    'footer.rights': 'All rights reserved.',
    'category.tech': 'Tech',
  },
  ko: {
    // Header
    'header.brand': '더 타임즈',
    'header.login': '로그인',
    
    // Categories
    'category.all': '전체',
    'category.politics': '정치',
    'category.economy': '경제',
    'category.society': '사회',
    'category.technology': '기술',
    'category.sports': '스포츠',
    'category.entertainment': '엔터',
    'category.world': '세계',
    'category.science': '과학',
    
    // Auth Modal
    'auth.login': '로그인',
    'auth.signup': '회원가입',
    'auth.login.subtitle': '더 타임즈에 오신 것을 환영합니다',
    'auth.signup.subtitle': '지금 바로 더 타임즈를 시작하세요',
    'auth.fullname': '이름',
    'auth.email': '이메일',
    'auth.password': '비밀번호',
    'auth.fullname.placeholder': '이름을 입력하세요',
    'auth.email.placeholder': 'example@email.com',
    'auth.password.placeholder': '비밀번호를 입력하세요',
    'auth.continue': '계속하기',
    'auth.create': '가입하기',
    'auth.no.account': '계정이 없으신가요?',
    'auth.have.account': '이미 계정이 있으신가요?',
    'auth.signup.link': '회원가입',
    'auth.login.link': '로그인',
    
    // Profile Modal
    'profile.country': '국가',
    'profile.language': '언어',
    'profile.notifications': '알림',
    'profile.darkmode': '다크 모드',
    'profile.logout': '로그아웃',
    
    // Countries
    'country.us': '미국',
    'country.kr': '대한민국',
    'country.cn': '중국',
    'country.jp': '일본',
    
    // Languages
    'language.en': 'English',
    'language.ko': '한국어',
    'language.zh': '中文',
    'language.ja': '日本語',
    
    // Side Menu
    'menu.home': '홈',
    'menu.trending': '인기',
    'menu.bookmarks': '북마크',
    'menu.settings': '설정',
    
    // News
    'news.loading': '뉴스를 불러오는 중...',
    'news.no.articles': '이 카테고리나 국가에 해당하는 기사가 없습니다.',
    'news.recommended': '추천 기사',
    'news.read.more': '더 읽기',
    
    // Footer
    'footer.news': '뉴스',
    'footer.opinion': '논란',
    'footer.more': '더 보기',
    'footer.subscribe': '구독하기',
    'footer.editorials': '에디터리얼',
    'footer.columns': '칼럼',
    'footer.contributors': '기고자',
    'footer.letters': '편지',
    'footer.multimedia': '멀티미디어',
    'footer.photography': '사진',
    'footer.video': '동영상',
    'footer.newsletters': '뉴스레터',
    'footer.home.delivery': '집배송',
    'footer.digital': '디지털 구독',
    'footer.gift': '선물 구독',
    'footer.group': '단체 구독',
    'footer.tagline': '1851년부터 정직한 독립 언론',
    'footer.newsletter.subscribe': '뉴스레터 구독하기',
    'footer.contact': '연락처',
    'footer.about': '회사 소개',
    'footer.privacy': '개인 정보 보호 정책',
    'footer.terms': '서비스 이용 약관',
    'footer.help': '도움말 센터',
    'footer.rights': '저작권 보호',
    'category.tech': '기술',
  },
  zh: {
    // Header
    'header.brand': '时报',
    'header.login': '登录',
    
    // Categories
    'category.all': '全部',
    'category.politics': '政治',
    'category.economy': '经济',
    'category.society': '社会',
    'category.technology': '技术',
    'category.sports': '体育',
    'category.entertainment': '娱乐',
    'category.world': '世界',
    'category.science': '科学',
    
    // Auth Modal
    'auth.login': '登录',
    'auth.signup': '注册',
    'auth.login.subtitle': '继续访问时报',
    'auth.signup.subtitle': '立即开始阅读时报',
    'auth.fullname': '姓名',
    'auth.email': '电子邮箱',
    'auth.password': '密码',
    'auth.fullname.placeholder': '输入您的姓名',
    'auth.email.placeholder': 'you@example.com',
    'auth.password.placeholder': '输入您的密码',
    'auth.continue': '继续',
    'auth.create': '创建账户',
    'auth.no.account': '没有账户？',
    'auth.have.account': '已有账户？',
    'auth.signup.link': '注册',
    'auth.login.link': '登录',
    
    // Profile Modal
    'profile.country': '国家',
    'profile.language': '语言',
    'profile.notifications': '通知',
    'profile.darkmode': '深色模式',
    'profile.logout': '退出登录',
    
    // Countries
    'country.us': '美国',
    'country.kr': '韩国',
    'country.cn': '中国',
    'country.jp': '日本',
    
    // Languages
    'language.en': 'English',
    'language.ko': '한국어',
    'language.zh': '中文',
    'language.ja': '日本語',
    
    // Side Menu
    'menu.home': '首页',
    'menu.trending': '热门',
    'menu.bookmarks': '书签',
    'menu.settings': '设置',
    
    // News
    'news.loading': '正在加载新闻...',
    'news.no.articles': '在此类别或国家中未找到文章。',
    'news.recommended': '推荐文章',
    'news.read.more': '阅读更多',
    
    // Footer
    'footer.news': '新闻',
    'footer.opinion': '评论',
    'footer.more': '更多',
    'footer.subscribe': '订阅',
    'footer.editorials': '社论',
    'footer.columns': '专栏',
    'footer.contributors': '撰稿人',
    'footer.letters': '读者来信',
    'footer.multimedia': '多媒体',
    'footer.photography': '摄影',
    'footer.video': '视频',
    'footer.newsletters': '通讯录',
    'footer.home.delivery': '家庭配送',
    'footer.digital': '数字订阅',
    'footer.gift': '礼品订阅',
    'footer.group': '团体订阅',
    'footer.tagline': '自1851年以来的独立新闻报道',
    'footer.newsletter.subscribe': '订阅通讯录',
    'footer.contact': '联系我们',
    'footer.about': '关于我们',
    'footer.privacy': '隐私政策',
    'footer.terms': '服务条款',
    'footer.help': '帮助中心',
    'footer.rights': '版权所有',
    'category.tech': '科技',
  },
  ja: {
    // Header
    'header.brand': 'ザ・タイムズ',
    'header.login': 'ログイン',
    
    // Categories
    'category.all': 'すべて',
    'category.politics': '政治',
    'category.economy': '経済',
    'category.society': '社会',
    'category.technology': 'テクノロジー',
    'category.sports': 'スポーツ',
    'category.entertainment': 'エンタメ',
    'category.world': '世界',
    'category.science': '科学',
    
    // Auth Modal
    'auth.login': 'ログイン',
    'auth.signup': 'アカウント作成',
    'auth.login.subtitle': 'ザ・タイムズへようこそ',
    'auth.signup.subtitle': '今すぐザ・タイムズを始める',
    'auth.fullname': '氏名',
    'auth.email': 'メールアドレス',
    'auth.password': 'パスワード',
    'auth.fullname.placeholder': 'お名前を入力',
    'auth.email.placeholder': 'you@example.com',
    'auth.password.placeholder': 'パスワードを入力',
    'auth.continue': '続ける',
    'auth.create': 'アカウント作成',
    'auth.no.account': 'アカウントをお持ちでないですか？',
    'auth.have.account': 'すでにアカウントをお持ちですか？',
    'auth.signup.link': '登録',
    'auth.login.link': 'ログイン',
    
    // Profile Modal
    'profile.country': '国',
    'profile.language': '言語',
    'profile.notifications': '通知',
    'profile.darkmode': 'ダークモード',
    'profile.logout': 'ログアウト',
    
    // Countries
    'country.us': 'アメリカ合衆国',
    'country.kr': '韓国',
    'country.cn': '中国',
    'country.jp': '日本',
    
    // Languages
    'language.en': 'English',
    'language.ko': '한국어',
    'language.zh': '中文',
    'language.ja': '日本語',
    
    // Side Menu
    'menu.home': 'ホーム',
    'menu.trending': 'トレンド',
    'menu.bookmarks': 'ブックマーク',
    'menu.settings': '設定',
    
    // News
    'news.loading': 'ニュースを読み込み中...',
    'news.no.articles': 'このカテゴリまたは国には記事が見つかりませんでした。',
    'news.recommended': 'おすすめ記事',
    'news.read.more': '続きを読む',
    
    // Footer
    'footer.news': 'ニュース',
    'footer.opinion': '意見',
    'footer.more': 'もっと見る',
    'footer.subscribe': '購読',
    'footer.editorials': '編集部記事',
    'footer.columns': 'コラム',
    'footer.contributors': '寄稿者',
    'footer.letters': '読者からの手紙',
    'footer.multimedia': 'マルチメディア',
    'footer.photography': '写真',
    'footer.video': 'ビデオ',
    'footer.newsletters': 'ニュースレター',
    'footer.home.delivery': '宅配',
    'footer.digital': 'デジタルサブスクリプション',
    'footer.gift': 'ギフトサブスクリプション',
    'footer.group': 'グループサブスクリプション',
    'footer.tagline': '1851年以来の独立したジャーナリズム',
    'footer.newsletter.subscribe': 'ニュースレターを購読',
    'footer.contact': 'お問い合わせ',
    'footer.about': '私たちについて',
    'footer.privacy': 'プライバシーポリシー',
    'footer.terms': '利用規約',
    'footer.help': 'ヘルプセンター',
    'footer.rights': 'すべての権利を保有しています。',
    'category.tech': 'テクノロジー',
  },
};