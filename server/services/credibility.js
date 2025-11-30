/**
 * 간단한 도메인 기반 휴리스틱 점수 (0~1)
 * - .gov/.edu 높은 점수
 * - 유명 뉴스 도메인(목록)에 높은 점수
 * - 개인 블로그, Medium 등 낮음
 * 필요하면 내부 리스트를 확장하세요.
 */
const HIGH_TRUST_DOMAINS = [
  'korea.kr', 'gov.kr', 'whitehouse.gov', 'who.int', 'nih.gov',
  'nytimes.com', 'bbc.co.uk', 'reuters.com', 'cnn.com', 'chosun.com', 'joongang.co.kr', 'hani.co.kr'
];

const LOW_TRUST_KEYWORDS = ['medium.com', 'blog', 'wordpress.com', 'tumblr.com', 'substack.com'];

export function domainCredibilityScore(domain) {
  if (!domain) return 0.5;
  const d = domain.toLowerCase();
  if (d.endsWith('.gov') || d.endsWith('.gov.kr') || d.endsWith('.edu')) return 0.95;
  if (HIGH_TRUST_DOMAINS.some(h => d.includes(h))) return 0.9;
  if (LOW_TRUST_KEYWORDS.some(k => d.includes(k))) return 0.2;
  // 기본값
  if (d.split('.').length <= 2) return 0.6;
  return 0.5;
}

/**
 * LLM score (0-1)과 domainAvg(0-1)을 결합
 * 가중치 예: LLM 70%, domain 30%
 */
export function aggregateCredibility(llmScore = 0.5, domainAvg = 0.5, weights = { llm: 0.7, domain: 0.3 }) {
  const s = (llmScore * weights.llm) + (domainAvg * weights.domain);
  return Math.max(0, Math.min(1, s));
}