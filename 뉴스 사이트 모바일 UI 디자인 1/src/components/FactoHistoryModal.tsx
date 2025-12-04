import { ArrowLeft, History, Trash2, CheckCircle, AlertCircle, XCircle, HelpCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FactoHistoryItem } from '../lib/factoHistoryService';

interface FactoHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  factoHistory: FactoHistoryItem[];
  onDeleteHistory: (historyId: string) => void;
  onClearHistory: () => void;
}

export function FactoHistoryModal({ 
  isOpen, 
  onClose, 
  factoHistory,
  onDeleteHistory,
  onClearHistory
}: FactoHistoryModalProps) {
  const { language, t } = useLanguage();
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FactoHistoryItem | null>(null);

  // 열림/닫힘 애니메이션
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      setSelectedItem(null);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'true':
      case 'mostly-true':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'false':
      case 'mostly-false':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'mixed':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'unverifiable':
        return <HelpCircle className="w-5 h-5 text-gray-600" />;
      default:
        return <HelpCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getVerdictText = (verdict: string) => {
    const verdictLabels: Record<string, Record<string, string>> = {
      en: {
        'true': 'True',
        'mostly-true': 'Mostly True',
        'mixed': 'Mixed',
        'mostly-false': 'Mostly False',
        'false': 'False',
        'unverifiable': 'Unverifiable'
      },
      ko: {
        'true': '사실',
        'mostly-true': '대체로 사실',
        'mixed': '혼합',
        'mostly-false': '대체로 거짓',
        'false': '거짓',
        'unverifiable': '검증 불가'
      },
      zh: {
        'true': '真实',
        'mostly-true': '大部分真实',
        'mixed': '混合',
        'mostly-false': '大部分虚假',
        'false': '虚假',
        'unverifiable': '无法验证'
      },
      ja: {
        'true': '真実',
        'mostly-true': 'ほぼ真実',
        'mixed': '混合',
        'mostly-false': 'ほぼ虚偽',
        'false': '虚偽',
        'unverifiable': '検証不可'
      }
    };
    return verdictLabels[language]?.[verdict] || verdict;
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
                {/* 뒤로가기 버튼 */}
                <div className="w-10 h-10">
                  <button
                    onClick={() => selectedItem ? setSelectedItem(null) : onClose()}
                    className="w-10 h-10 p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md transition-colors"
                    aria-label="뒤로가기"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                  </button>
                </div>

                {/* 제목 - 중앙 정렬 */}
                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <h1 className="text-xl sm:text-2xl text-gray-900 dark:text-white tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                    {t('menu.history') || 'Facto 기록'}
                  </h1>
                </div>

                {/* 전체 삭제 버튼 */}
                <div className="w-auto">
                  {!selectedItem && factoHistory.length > 0 && (
                    <button
                      onClick={() => {
                        if (confirm(t('settings.clearHistory.confirm') || '모든 기록을 삭제하시겠습니까?')) {
                          onClearHistory();
                        }
                      }}
                      className="text-xs sm:text-sm px-3 sm:px-5 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 border border-red-200 dark:border-red-800 transition-colors tracking-wide"
                    >
                      {t('settings.clearAll') || '전체 삭제'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* 본문 - fade in 애니메이션 */}
          <div 
            className={`max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-opacity duration-700 delay-200 ${
              isAnimating ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {!selectedItem ? (
              // 목록 보기
              <div className="space-y-6">
                {factoHistory.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <History className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-sm" style={{ fontFamily: 'Georgia, serif' }}>
                      {t('settings.no.history') || '분석 기록이 없습니다.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {factoHistory.map((item) => (
                      <div 
                        key={item.id} 
                        className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-4 sm:p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-colors cursor-pointer"
                        onClick={() => setSelectedItem(item)}
                      >
                        {/* 날짜 */}
                        <div className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                          {new Date(item.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>

                        {/* 입력 텍스트 */}
                        <p className="text-sm sm:text-base text-gray-900 dark:text-white line-clamp-2 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                          {item.inputText}
                        </p>

                        {/* 결과 요약 */}
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-2">
                            {getVerdictIcon(item.result.verdict)}
                            <span className="text-sm">
                              {getVerdictText(item.result.verdict)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {t('facto.credibility') || 'Score'}:
                            </span>
                            <span className="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-900">
                              {item.result.credibilityScore}%
                            </span>
                          </div>
                        </div>

                        {/* 삭제 버튼 */}
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(t('settings.delete.confirm') || '이 기록을 삭제하시겠습니까?')) {
                                onDeleteHistory(item.id);
                              }
                            }}
                            className="text-xs px-3 py-1.5 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 border border-gray-200 dark:border-gray-800 hover:border-red-200 dark:hover:border-red-800 transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>{t('settings.delete') || '삭제'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // 상세 보기
              <div className="space-y-8">
                {/* 입력 텍스트 */}
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                    {new Date(selectedItem.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <p className="text-base sm:text-lg text-gray-900 dark:text-white leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                    {selectedItem.inputText}
                  </p>
                </div>

                {/* 신뢰도 점수 및 판정 */}
                <div className="bg-gray-50 dark:bg-gray-950 p-6 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getVerdictIcon(selectedItem.result.verdict)}
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {t('facto.verdict') || 'Verdict'}
                        </div>
                        <div className="text-xl" style={{ fontFamily: 'Georgia, serif' }}>
                          {getVerdictText(selectedItem.result.verdict)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {t('facto.credibility') || 'Credibility Score'}
                      </div>
                      <div className="text-3xl" style={{ fontFamily: 'Georgia, serif' }}>
                        {selectedItem.result.credibilityScore}%
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                    {selectedItem.result.summary}
                  </p>
                </div>

                {/* 주요 발견 사항 */}
                {selectedItem.result.keyFindings.length > 0 && (
                  <div>
                    <h3 className="text-lg mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                      {t('facto.key.findings') || 'Key Findings'}
                    </h3>
                    <div className="space-y-4">
                      {selectedItem.result.keyFindings.map((finding, index) => (
                        <div key={index} className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 py-2">
                          <div className="text-sm mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                            {finding.claim}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                            {finding.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 출처 */}
                {selectedItem.result.sources.length > 0 && (
                  <div>
                    <h3 className="text-lg mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                      {t('facto.sources') || 'Sources'}
                    </h3>
                    <div className="space-y-2">
                      {selectedItem.result.sources.map((source, index) => (
                        <a
                          key={index}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-3 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors"
                        >
                          <span className="text-sm text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Georgia, serif' }}>
                            {source.title}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* 삭제 버튼 */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <button
                    onClick={() => {
                      if (confirm(t('settings.delete.confirm') || '이 기록을 삭제하시겠습니까?')) {
                        onDeleteHistory(selectedItem.id);
                        setSelectedItem(null);
                      }
                    }}
                    className="text-sm px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 border border-red-200 dark:border-red-800 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{t('settings.delete') || '삭제'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
