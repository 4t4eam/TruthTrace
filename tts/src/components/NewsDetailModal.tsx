import { ArrowLeft, Clock, Share2, Bookmark } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { NewsCard } from './NewsCard';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  time: string;
  content?: string;
}

interface NewsDetailModalProps {
  news: NewsItem;
  onClose: () => void;
  recommendedNews: NewsItem[];
}

export function NewsDetailModal({ news, onClose, recommendedNews }: NewsDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white dark:bg-black">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md transition-all duration-200 hover:scale-110"
              aria-label="뒤로가기"
            >
              <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-gray-100" />
            </button>

            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md transition-all duration-200 hover:scale-110">
                <Bookmark className="w-5 h-5 text-gray-900 dark:text-gray-100" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md transition-all duration-200 hover:scale-110">
                <Share2 className="w-5 h-5 text-gray-900 dark:text-gray-100" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 콘텐츠 */}
      <article className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* 카테고리 & 시간 */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-6">
          <span className="uppercase tracking-wide">{news.category}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{news.time}</span>
          </div>
        </div>

        {/* 제목 */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl leading-tight text-gray-900 dark:text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          {news.title}
        </h1>

        {/* 서브 헤딩 */}
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-10 border-l-2 border-gray-300 dark:border-gray-700 pl-4">
          {news.description}
        </p>

        {/* 이미지 */}
        <figure className="mb-10">
          <div className="aspect-[16/10] w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
            <ImageWithFallback
              src={news.image}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>
        </figure>

        {/* 본문 */}
        <div className="prose prose-lg max-w-none">
          <div className="text-gray-800 dark:text-gray-300 leading-relaxed space-y-6" style={{ fontFamily: 'Georgia, serif' }}>
            {news.content ? (
              <p>{news.content}</p>
            ) : (
              <>
                <p className="first-letter:text-6xl first-letter:font-bold first-letter:mr-2 first-letter:float-left first-letter:leading-none first-letter:text-gray-900 dark:first-letter:text-white">
                  {news.description}
                </p>
                
                <p>
                  이 기사는 최근 업계에서 큰 관심을 받고 있는 주제입니다. 전문가들은 이번 발표가 향후 산업 전반에 걸쳐 큰 영향을 미칠 것으로 전망하고 있습니다.
                </p>

                <p>
                  관련 업계 관계자들은 "이번 발표는 매우 의미있는 진전"이라며 "앞으로의 발전이 기대된다"고 밝혔습니다.
                </p>

                <p>
                  한편, 이와 관련된 추가적인 발표가 다음 주에 예정되어 있어 업계의 관심이 집중되고 있습니다. 전문가들은 이러한 변화가 시장에 긍정적인 영향을 미칠 것으로 보고 있으며, 관련 기업들의 주가도 상승세를 보이고 있습니다.
                </p>

                <p>
                  업계 전문가들은 이번 발표가 단순한 제품 출시를 넘어 산업 전반의 패러다임 변화를 이끌 것으로 예상하고 있습니다. 특히 새로운 기술의 도입으로 인해 관련 시장이 급성장할 것으로 전망됩니다.
                </p>
              </>
            )}
          </div>
        </div>

        {/* 추천 뉴스 */}
        {recommendedNews.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl text-gray-900 dark:text-white mb-8" style={{ fontFamily: 'Georgia, serif' }}>
              More in {news.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendedNews.slice(0, 3).map((item) => (
                <div key={item.id}>
                  <NewsCard {...item} />
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}