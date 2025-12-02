import { X, Search, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface FactoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FactoModal({ isOpen, onClose }: FactoModalProps) {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // 모달 열기
      setShouldRender(true);
      // 다음 프레임에 애니메이션 시작 (더블 requestAnimationFrame으로 확실하게)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      // 모달 닫기 - 애니메이션 먼저
      setIsAnimating(false);
      // 애니메이션 완료 후 DOM에서 제거
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 500); // 애니메이션 duration과 일치
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setIsProcessing(true);
    // 여기에 Facto 처리 로직 추가
    setTimeout(() => {
      setIsProcessing(false);
      // 처리 완료 후 동작
      console.log('Facto 분석:', input);
    }, 2000);
  };

  if (!shouldRender) return null;

  return (
    <>
      {/* 오버레이 - fade 애니메이션 */}
      <div 
        className={`fixed top-[56px] sm:top-[64px] left-0 right-0 bottom-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-500 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* 모달 - 상단바 아래 전체화면 (슬라이드 업 애니메이션) */}
      <div 
        className={`fixed top-[56px] sm:top-[64px] left-0 right-0 bottom-0 z-50 overflow-y-auto bg-white dark:bg-black transform transition-transform duration-500 ease-out ${
          isAnimating ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div onClick={(e) => e.stopPropagation()}>
          {/* 본문 - fade in 애니메이션 */}
          <article 
            className={`max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-opacity duration-700 delay-200 ${
              isAnimating ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 입력 영역 */}
              <div>
                <label 
                  htmlFor="facto-input" 
                  className="block text-sm text-gray-700 dark:text-gray-300 mb-3"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {t('facto.input.label') || 'Enter text to analyze'}
                </label>
                <textarea
                  id="facto-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('facto.input.placeholder') || 'Paste a news article, claim, or statement to fact-check...'}
                  className="w-full min-h-[300px] px-4 py-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white resize-none"
                  style={{ fontFamily: 'Georgia, serif' }}
                  disabled={isProcessing}
                />
                <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-500">
                  <span>
                    {input.length} {t('facto.characters') || 'characters'}
                  </span>
                  {input.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setInput('')}
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                      {t('facto.clear') || 'Clear'}
                    </button>
                  )}
                </div>
              </div>

              {/* 예시 버튼 */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="px-4 py-2 text-xs border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  onClick={() => setInput(t('facto.example.1') || 'The moon landing was filmed in a Hollywood studio.')}
                >
                  {t('facto.example.label') || 'Example'} 1
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-xs border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  onClick={() => setInput(t('facto.example.2') || 'Drinking 8 glasses of water daily is essential for health.')}
                >
                  {t('facto.example.label') || 'Example'} 2
                </button>
              </div>

              {/* 제출 버튼 */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={!input.trim() || isProcessing}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                >
                  {isProcessing ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>{t('facto.analyzing') || 'Analyzing...'}</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>{t('facto.analyze') || 'Analyze'}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  {t('common.cancel') || 'Cancel'}
                </button>
              </div>
            </form>

            {/* 정보 섹션 */}
            <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
              <h3 className="text-xl text-gray-900 dark:text-white mb-6 flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
                <Sparkles className="w-5 h-5" />
                {t('facto.info.title') || 'How Facto works'}
              </h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                <li className="pl-6 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
                  {t('facto.info.1') || 'AI analyzes the credibility of statements and claims'}
                </li>
                <li className="pl-6 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
                  {t('facto.info.2') || 'Cross-references with reliable news sources'}
                </li>
                <li className="pl-6 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
                  {t('facto.info.3') || 'Provides context and related information'}
                </li>
                <li className="pl-6 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
                  {t('facto.info.4') || 'Identifies potential misinformation'}
                </li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}