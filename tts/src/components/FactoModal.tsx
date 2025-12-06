import { X, Search, Sparkles, CheckCircle, AlertCircle, XCircle, HelpCircle, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FactoService, FactoAnalysisResult } from '../lib/factoService';
import { FactoHistoryService, FactoHistoryItem } from '../lib/factoHistoryService';

interface FactoModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onHistoryAdd: (item: FactoHistoryItem) => void;
}

export function FactoModal({ isOpen, onClose, userId, onHistoryAdd }: FactoModalProps) {
  const { language, t } = useLanguage();
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FactoAnalysisResult | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !userId) return;
    
    setIsProcessing(true);
    try {
      const result = await FactoService.analyzeText(input, language);
      setAnalysisResult(result);
      
      // 히스토리 서비스를 통해 저장 및 상태에 추가
      const historyItem = await FactoHistoryService.addHistory(userId, input, result);
      onHistoryAdd(historyItem);
    } catch (error) {
      console.error('Facto 분석 오류:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewAnalysis = () => {
    setInput('');
    setAnalysisResult(null);
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'true':
      case 'mostly-true':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'false':
      case 'mostly-false':
        return <XCircle className="w-6 h-6 text-red-600" />;
      case 'mixed':
        return <AlertCircle className="w-6 h-6 text-yellow-600" />;
      case 'unverifiable':
        return <HelpCircle className="w-6 h-6 text-gray-600" />;
      default:
        return <HelpCircle className="w-6 h-6 text-gray-600" />;
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'disputed':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'false':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'unverifiable':
        return <HelpCircle className="w-4 h-4 text-gray-600" />;
      default:
        return <HelpCircle className="w-4 h-4 text-gray-600" />;
    }
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
            {!analysisResult ? (
              <>
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
              </>
            ) : (
              <>
                {/* 분석 결과 */}
                <div className="space-y-8">
                  {/* 신뢰도 점수 및 판정 */}
                  <div className="bg-gray-50 dark:bg-gray-950 p-6 border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getVerdictIcon(analysisResult.verdict)}
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {t('facto.verdict') || 'Verdict'}
                          </div>
                          <div className="text-xl" style={{ fontFamily: 'Georgia, serif' }}>
                            {getVerdictText(analysisResult.verdict)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {t('facto.credibility') || 'Credibility Score'}
                        </div>
                        <div className="text-3xl" style={{ fontFamily: 'Georgia, serif' }}>
                          {analysisResult.credibilityScore}%
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                      {analysisResult.summary}
                    </p>
                  </div>

                  {/* 주요 발견 사항 */}
                  {analysisResult.keyFindings.length > 0 && (
                    <div>
                      <h3 className="text-lg mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                        {t('facto.key.findings') || 'Key Findings'}
                      </h3>
                      <div className="space-y-4">
                        {analysisResult.keyFindings.map((finding, index) => (
                          <div key={index} className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 py-2">
                            <div className="flex items-start gap-2 mb-2">
                              {getStatusIcon(finding.status)}
                              <div className="text-sm" style={{ fontFamily: 'Georgia, serif' }}>
                                {finding.claim}
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed ml-6" style={{ fontFamily: 'Georgia, serif' }}>
                              {finding.explanation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 출처 */}
                  {analysisResult.sources.length > 0 && (
                    <div>
                      <h3 className="text-lg mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                        {t('facto.sources') || 'Sources'}
                      </h3>
                      <div className="space-y-2">
                        {analysisResult.sources.map((source, index) => (
                          <a
                            key={index}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors group"
                          >
                            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" style={{ fontFamily: 'Georgia, serif' }}>
                              {source.title}
                            </span>
                            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 맥락 */}
                  {analysisResult.context && (
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-4">
                      <h3 className="text-sm mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                        {t('facto.context') || 'Context'}
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                        {analysisResult.context}
                      </p>
                    </div>
                  )}

                  {/* 경고 */}
                  {analysisResult.warnings.length > 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 p-4">
                      <h3 className="text-sm mb-2 flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
                        <AlertCircle className="w-4 h-4" />
                        {t('facto.warnings') || 'Warnings'}
                      </h3>
                      <ul className="space-y-1">
                        {analysisResult.warnings.map((warning, index) => (
                          <li key={index} className="text-xs text-gray-700 dark:text-gray-300 pl-4 relative before:content-['•'] before:absolute before:left-0" style={{ fontFamily: 'Georgia, serif' }}>
                            {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 새 분석 버튼 */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleNewAnalysis}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200"
                    >
                      <Search className="w-4 h-4" />
                      <span>{t('facto.new.analysis') || 'New Analysis'}</span>
                    </button>
                    <button
                      onClick={onClose}
                      className="px-6 py-3 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      {t('common.close') || 'Close'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </article>
        </div>
      </div>
    </>
  );
}