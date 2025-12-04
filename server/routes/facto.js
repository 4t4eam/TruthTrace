import express from 'express';
import axios from 'axios';

const router = express.Router();

// 입력값이 URL인지 확인
const isUrl = (text) => {
  try {
    const u = new URL(text);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

// URL에서 본문 가져오기 (간단 버전)
async function fetchUrlContent(url) {
  try {
    const res = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36"
      }
    });
    return res.data;
  } catch (e) {
    return null;
  }
}

/**
 * 1) 사용자 입력 -> Gemini 요청 -> SerpAPI 검색 쿼리 생성
 * 2) SerpAPI 검색
 * 3) 검색 결과 + 사용자 입력 -> Gemini -> 문장별 신뢰도 평가 및 색칠된 Markdown 생성
 * 4) 최종 결과 반환
 */
router.post('/analyze', async (req, res) => {
  try {
    let { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'No text provided' });
    }

    // ----------------------------
    // (추가) 입력이 URL이면 본문 내용 가져오기
    // ----------------------------
    if (isUrl(text.trim())) {
      const html = await fetchUrlContent(text.trim());
      if (!html) {
        return res.status(400).json({ error: 'URL content fetch failed' });
      }

      // HTML 제거 후 텍스트화
      const plain = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (plain.length > 4000) {
        text = plain.slice(0, 4000); // 너무 길면 4000자로 제한
      }
    }

    // -------------------------------
    // 1단계: Gemini에게 검색 쿼리 생성 요청
    // -------------------------------
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const serpApiKey = process.env.SERP_API_KEY;

    const geminiQueryPrompt = `
사용자가 입력한 텍스트:
"${text}"

이 텍스트의 사실 여부를 검증하기 위해
SerpAPI에서 검색해야 할 가장 적합한 검색 쿼리 2개만 생성해라.

형식:
["query1", "query2"]
`;

    const geminiQueryRes = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + geminiApiKey,
      {
        contents: [{ parts: [{ text: geminiQueryPrompt }] }]
      }
    );

    const rawQueryText =
      geminiQueryRes.data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';

    let searchQueries = [];
    try {
      searchQueries = JSON.parse(rawQueryText);
    } catch {
      searchQueries = [];
    }

    if (!Array.isArray(searchQueries) || searchQueries.length === 0) {
      searchQueries = [text]; // fallback
    }

    // -------------------------------
    // 2단계: SerpAPI로 검색
    // -------------------------------
    const serpResults = [];

    for (const q of searchQueries) {
      const serpUrl = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(
        q
      )}&api_key=${serpApiKey}`;

      const serpRes = await axios.get(serpUrl);
      serpResults.push({
        query: q,
        organic_results: serpRes.data.organic_results || [],
      });
    }

    // -------------------------------
    // 3단계: Gemini로 신뢰도 분석
    // -------------------------------
    const geminiFactPrompt = `
아래는 사용자가 입력한 텍스트이다:
"${text}"

그리고 다음은 SerpAPI 결과이다:
${JSON.stringify(serpResults, null, 2)}

요구사항:
1. 사용자 입력을 문장별로 나누어라.
2. 각 문장에 대해 "신뢰도 높음/중간/낮음"을 판단해라.
3. 마크다운 형식으로 출력하고, 각 문장에 색을 입혀라.
   - 신뢰도 높음 → 초록: <span style="color: green">문장</span>
   - 신뢰도 중간 → 노랑: <span style="color: orange">문장</span>
   - 신뢰도 낮음 → 빨강: <span style="color: red">문장</span>
4. 마지막에 "최종 신뢰도 요약"을 제공하라.
5. "출처" 섹션에서 참고한 검색 결과의 링크를 나열하라.
6. 마크다운 문법보다는 html 태그를 사용하라. (**강조**가 아닌 <strong>강조</strong>, ~~취소선~~이 아닌 <ins>취소선</ins>)
7. 크롤링, 또는 단순 복사로 인하여 광고 등 본문과는 전혀 관계 없는 이상한 내용이 있다면 제외하고 출력하라.

출력 형식:
[문장별로 색칠된 사용자 입력 (마크다운이 아닌 HTML 문법으로 작성)]
[최종 신뢰도 요약]
`;

    const geminiFactRes = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + geminiApiKey,
      {
        contents: [{ parts: [{ text: geminiFactPrompt }] }]
      }
    );

    const finalMarkdown =
      geminiFactRes.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'No analysis produced';

    res.json({
      ok: true,
      queries: searchQueries,
      results: serpResults,
      markdown: finalMarkdown
    });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: 'Facto analyze failed' });
  }
});

export default router;
