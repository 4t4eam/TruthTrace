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

// URL에서 본문 가져오기
async function fetchUrlContent(url) {
  try {
    const res = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36"
      }
    });
    return res.data;
  } catch {
    return null;
  }
}

function cleanJsonText(text) {
  if (!text) return text;

  return text
    .trim()
    .replace(/^```json/i, '')  // 시작 부분의 ```json 제거
    .replace(/^```/i, '')      // 시작 부분의 ``` 제거
    .replace(/```$/, '')       // 끝 부분의 ``` 제거
    .trim();
}

/**
 * 1) 사용자 입력 -> Gemini 요청 -> SerpAPI 검색 쿼리 생성
 * 2) SerpAPI 검색
 * 3) 검색 결과 + 사용자 입력 -> Gemini -> FactoAnalysisResult 형식의 JSON 생성
 * 4) 최종 결과 반환
 */
router.post('/analyze', async (req, res) => {
  try {
    let { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'No text provided' });
    }

    // URL 처리
    if (isUrl(text.trim())) {
      const html = await fetchUrlContent(text.trim());
      if (!html) {
        return res.status(400).json({ error: 'URL content fetch failed' });
      }

      const plain = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      text = plain.length > 4000 ? plain.slice(0, 4000) : plain;
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    const serpApiKey = process.env.SERP_API_KEY;

    // -------------------------
    // 1) Gemini: 검색 쿼리 생성
    // -------------------------
    const geminiQueryPrompt = `
사용자가 입력한 텍스트:
"${text}"

이 텍스트의 사실 여부를 검증하기 위해 SerpAPI에서 검색해야 할 가장 적합한 검색 쿼리를 최대 2개까지만 생성해라.
만일 검색 쿼리가 많이 필요없다면 1개만 사용하라.

형식:
["query1", "query2"]
`;

    const geminiQueryRes = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + geminiApiKey,
      { contents: [{ parts: [{ text: geminiQueryPrompt }] }] }
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
      searchQueries = [text];
    }

    // -------------------------
    // 2) SerpAPI 검색
    // -------------------------
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

    // -------------------------
    // 3) Gemini: FactoAnalysisResult 생성
    // -------------------------
    const geminiFactPrompt = `
아래는 사용자가 입력한 텍스트이다:
"${text}"

다음은 SerpAPI 검색 결과이다:
${JSON.stringify(serpResults, null, 2)}

다음 형식의 JSON만 생성하라. 설명, 여분 텍스트 없이 JSON만 출력한다:

{
  "credibilityScore": number,
  "verdict": "true" | "mostly-true" | "mixed" | "mostly-false" | "false" | "unverifiable",
  "summary": string,
  "keyFindings": [
    {
      "claim": string,
      "status": "verified" | "disputed" | "false" | "unverifiable",
      "explanation": string
    }
  ],
  "sources": [
    {
      "title": string,
      "url": string,
      "credibility": "high" | "medium" | "low"
    }
  ],
  "context": string,
  "warnings": string[]
}

주의:
1. 출력은 반드시 JSON 형식만 포함해야 한다.
2. HTML이나 마크다운을 포함하지 않는다.
3. SerpAPI 결과를 근거로 객관적 사실 기반 분석을 생성하라.
4. claim은 원문 텍스트의 핵심 주장 단위로 나눈다.
5. summary는 전체 내용을 짧고 명확하게 요약한다.
6. credibilityScore는 0~100 정수로 계산하라.
`;

    const geminiFactRes = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + geminiApiKey,
      { contents: [{ parts: [{ text: geminiFactPrompt }] }] }
    );

    const rawJson =
      geminiFactRes.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    const cleaned = cleanJsonText(rawJson);

    let finalJson = {};
    try {
      finalJson = JSON.parse(cleaned);
    } catch {
      console.log(cleaned);
      return res.status(500).json({ error: 'Failed to parse Gemini JSON output', raw: rawJson, cleaned });
    }

    res.json({
      ok: true,
      queries: searchQueries,
      results: serpResults,
      analysis: finalJson
    });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: 'Facto analyze failed' });
  }
});

export default router;
