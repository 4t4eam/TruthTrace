import express from 'express';
import { isUrl, fetchUrlText } from '../services/fetcher.js';
import { generateQueryWithGemini, evaluateCredibilityWithGemini } from '../services/gemini.js';
import { serpSearch } from '../services/serpapi.js';
import { domainCredibilityScore, aggregateCredibility } from '../services/credibility.js';
import { makeMarkdownResult } from '../utils/markdown.js';

const router = express.Router();

/**
 * POST /api/chat
 * body: { input: string, userId?: string }
 *
 * Flow:
 * 1) if input is URL -> fetch page text
 * 2) ask Gemini to create search query from user input (and page text if present)
 * 3) call SerpAPI with query -> results
 * 4) ask Gemini (혹은 내부 로직)로 문장단위 신뢰도 평가 (search 결과 포함)
 * 5) 합산된 평가, 시각화에 필요한 데이터, Markdown 결과 반환
 */
router.post('/', async (req, res) => {
  try {
    const { input, userId } = req.body;
    if (!input) return res.status(400).json({ error: 'input 필요' });

    // 1) URL이면 페이지 본문 가져오기
    let sourceText = null;
    let sourceUrl = null;
    if (isUrl(input)) {
      sourceUrl = input;
      sourceText = await fetchUrlText(input);
    }

    // 2) 생성된 검색 쿼리 (Gemini)
    const basePromptForQuery = sourceText
      ? `사용자가 제공한 웹페이지 내용을 바탕으로, 핵심 요약과 이 내용을 검증하기 위한 최적화된 검색 쿼리 3개를 한국어로 생성하세요. 페이지: ${sourceUrl}\n본문:\n${sourceText.slice(0, 4000)}`
      : `사용자 입력: "${input}". 이 입력을 검증하거나 관련 정보를 찾기 위한 최적화된 검색 쿼리 3개를 한국어로 생성하세요.`;

    const queries = await generateQueryWithGemini(basePromptForQuery);

    // queries는 배열로 리턴된다고 가정 (서비스 구현부에서 파싱)
    const searchResults = [];
    for (const q of queries.slice(0, 3)) {
      const r = await serpSearch(q);
      searchResults.push({ query: q, results: r });
    }

    // 3) 문장 단위로 쪼개기 (원문 또는 사용자의 입력)
    const textToEvaluate = sourceText || input;
    const sentences = textToEvaluate
      .replace(/\n+/g, '\n')
      .split(/(?<=[.?!。！？\n])\s+/)
      .map(s => s.trim())
      .filter(Boolean)
      .slice(0, 200); // 너무 길면 제한

    // 4) 각 sentence에 대해 도메인 휴리스틱 점수 + LLM 평가 병합
    //  - 먼저 도메인별 신뢰도(서치 결과의 출처들 기준)
    const domainScores = {};
    for (const sr of searchResults) {
      for (const item of sr.results.slice(0, 6)) {
        const domain = (new URL(item.link || item.url)).hostname;
        domainScores[domain] = domainScores[domain] ?? domainCredibilityScore(domain);
      }
    }

    // 5) LLM에게 문장별 신뢰도 판단 요청 (searchResults 포함 간단 요약 제공)
    const evalPrompt = `
아래는 사용자 텍스트의 문장들입니다. 각 문장 옆에 '높음', '중간', '낮음' 중 하나로 신뢰도를 평가하고, 그 이유(근거: 어떤 검색 결과에서 뒷받침되는지 또는 반박되는지)와 신뢰도 점수(0-1 소수)를 제공하세요.
문장들:
${sentences.map((s, i) => `${i+1}. ${s}`).join('\n')}

아래는 검색 결과의 요약(각 query별 top5의 타이틀/스니펫/링크):
${searchResults.map((sr, i) => `Query ${i+1}: ${sr.query}\n${sr.results.slice(0,5).map((r,j)=>`${j+1}. ${r.title} | ${r.snippet} | ${r.link}`).join('\n')}\n`).join('\n')}

출력은 JSON 배열로: [{index: <int>, sentence: <str>, label: "높음"|"중간"|"낮음", score: 0.0-1.0, reasons: ["도메인A: 근거 요약", ...]}]
`
    const sentenceEvaluations = await evaluateCredibilityWithGemini(evalPrompt, sentences);

    // 6) aggregate: 도메인 휴리스틱과 LLM 점수를 결합
    const merged = sentenceEvaluations.map(ev => {
      // ev.score: 0-1 from LLM
      // find supporting domains from reasons (간단 파싱)
      const supportingDomains = (ev.reasons || [])
        .map(r => {
          const m = r.match(/https?:\/\/([^\/\s]+)/);
          return m ? m[1] : null;
        })
        .filter(Boolean);

      const domainAvg = supportingDomains.length
        ? supportingDomains.reduce((acc, d) => acc + (domainScores[d] ?? 0.5), 0) / supportingDomains.length
        : 0.5;

      const finalScore = aggregateCredibility(ev.score, domainAvg); // 함수 구현 참고
      let finalLabel = '중간';
      if (finalScore >= 0.7) finalLabel = '높음';
      else if (finalScore <= 0.35) finalLabel = '낮음';

      return {
        index: ev.index,
        sentence: ev.sentence,
        llmScore: ev.score,
        domainAvg,
        finalScore,
        finalLabel,
        reasons: ev.reasons || []
      };
    });

    // 7) 시각화용 요약(도메인 분포, 레이블 비율 등)
    const counts = { 높음:0, 중간:0, 낮음:0 };
    merged.forEach(m => counts[m.finalLabel]++);

    const visualization = {
      totalSentences: merged.length,
      labelCounts: counts,
      labelPercentages: {
        높음: (counts.높음/merged.length)*100,
        중간: (counts.중간/merged.length)*100,
        낮음: (counts.낮음/merged.length)*100,
      },
      domainScores // 도메인별 점수
    };

    // 8) Markdown 출력 생성
    const markdown = makeMarkdownResult({
      input,
      sourceUrl,
      queries,
      searchResults,
      merged,
      visualization
    });

    // 9) 응답
    return res.json({
      markdown,
      visualization,
      sentences: merged,
      queries,
      searchResults
    });

  } catch (err) {
    console.error('chat route error', err);
    return res.status(500).json({ error: err.message || '서버 오류' });
  }
});

export default router;