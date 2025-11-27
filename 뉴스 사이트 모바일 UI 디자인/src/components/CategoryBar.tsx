import { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface CategoryBarProps {
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export function CategoryBar({ categories, selectedCategory, onCategorySelect }: CategoryBarProps) {
  const { t, language } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // 카테고리 번역 매핑
  const categoryMap: Record<string, string> = {
    '전체': 'category.all',
    '정치': 'category.politics',
    '경제': 'category.economy',
    '사회': 'category.society',
    '기술': 'category.technology',
    '스포츠': 'category.sports',
    '엔터': 'category.entertainment',
    '세계': 'category.world',
    '과학': 'category.science',
  };

  const getCategoryLabel = (category: string) => {
    return t(categoryMap[category] || category);
  };

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="sticky top-[56px] sm:top-[64px] z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* 왼쪽 화살표 */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-black p-1.5 shadow-lg rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            aria-label="왼쪽으로 스크롤"
          >
            <ChevronLeft className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          </button>
        )}

        {/* 카테고리 목록 - 중앙 정렬 */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto scrollbar-hide py-3 sm:py-4 justify-start sm:justify-center"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategorySelect(category)}
              className={`whitespace-nowrap pb-1 transition-all duration-200 border-b-2 text-sm sm:text-base flex-shrink-0 hover:scale-110 ${
                selectedCategory === category
                  ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {getCategoryLabel(category)}
            </button>
          ))}
        </div>

        {/* 오른쪽 화살표 */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-black p-1.5 shadow-lg rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            aria-label="오른쪽으로 스크롤"
          >
            <ChevronRight className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          </button>
        )}
      </div>
    </div>
  );
}