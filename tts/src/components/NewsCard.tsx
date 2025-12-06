import { Clock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface NewsCardProps {
  title: string;
  description: string;
  image: string;
  category: string;
  time: string;
  onClick?: () => void;
}

export function NewsCard({ title, description, image, category, time, onClick }: NewsCardProps) {
  return (
    <article 
      onClick={onClick}
      className="group cursor-pointer transition-all duration-300 hover:scale-[1.02]"
    >
      {/* 이미지 */}
      <div className="aspect-[16/10] w-full overflow-hidden bg-gray-100 dark:bg-gray-900 mb-4 border border-gray-200 dark:border-gray-800 transition-all duration-300 group-hover:border-gray-400 dark:group-hover:border-gray-600">
        <ImageWithFallback 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* 콘텐츠 */}
      <div className="space-y-2">
        {/* 카테고리 & 시간 */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="uppercase tracking-wide">{category}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{time}</span>
          </div>
        </div>
        
        {/* 제목 */}
        <h2 className="text-xl sm:text-2xl leading-tight text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300 line-clamp-3" style={{ fontFamily: 'Georgia, serif' }}>
          {title}
        </h2>
        
        {/* 설명 */}
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>
    </article>
  );
}