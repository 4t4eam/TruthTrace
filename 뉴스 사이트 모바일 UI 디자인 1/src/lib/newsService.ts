// 뉴스 데이터 타입 정의
export interface NewsItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  time: string;
  content?: string;
  country: string;  // 뉴스의 국가 (United States, South Korea, China, Japan)
  language: string; // 뉴스의 언어 (en, ko, zh, ja)
  createdAt?: string;
}

// Mock 데이터 import
import { mockNewsData } from './newsData';

// 뉴스 서비스 클래스
export class NewsService {
  // 모든 뉴스 가져오기
  static async getAllNews(): Promise<NewsItem[]> {
    // 추후 Supabase로 대체
    // const { data, error } = await supabase.from('news').select('*').order('createdAt', { ascending: false });
    // if (error) throw error;
    // return data;
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockNewsData), 100);
    });
  }

  // 카테고리별 뉴스 필터링
  static async getNewsByCategory(category: string): Promise<NewsItem[]> {
    const allNews = await this.getAllNews();
    if (category === '전체') return allNews;
    return allNews.filter(news => news.category === category);
  }

  // 국가별 뉴스 필터링
  static async getNewsByCountry(country: string): Promise<NewsItem[]> {
    const allNews = await this.getAllNews();
    return allNews.filter(news => news.country === country);
  }

  // 언어별 뉴스 필터링
  static async getNewsByLanguage(language: string): Promise<NewsItem[]> {
    const allNews = await this.getAllNews();
    return allNews.filter(news => news.language === language);
  }

  // 카테고리 + 국가 + 언어 필터링
  static async getNewsByCategoryAndCountry(
    category: string, 
    country: string, 
    language: string
  ): Promise<NewsItem[]> {
    const allNews = await this.getAllNews();
    return allNews.filter(news => {
      const categoryMatch = category === '전체' || news.category === category;
      const countryMatch = news.country === country;
      const languageMatch = news.language === language;
      return categoryMatch && countryMatch && languageMatch;
    });
  }

  // 호환성을 위한 기존 메소드 (deprecated)
  static async getNewsByCategoryAndRegion(category: string, region: string): Promise<NewsItem[]> {
    return this.getNewsByCategoryAndCountry(category, region, 'ko');
  }

  // 단일 뉴스 가져오기
  static async getNewsById(id: string): Promise<NewsItem | null> {
    const allNews = await this.getAllNews();
    return allNews.find(news => news.id === id) || null;
  }

  // 추천 뉴스 가져오기 (같은 카테고리, 같은 언어, 다른 기사)
  static async getRecommendedNews(
    currentNewsId: string, 
    category: string, 
    language: string,
    limit: number = 3
  ): Promise<NewsItem[]> {
    const allNews = await this.getAllNews();
    return allNews
      .filter(news => 
        news.category === category && 
        news.id !== currentNewsId && 
        news.language === language
      )
      .slice(0, limit);
  }
}