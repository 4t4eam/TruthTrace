import axios from 'axios';

/**
 * 환경변수:
 *  - GEMINI_API_URL  (예: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent)
 *  - GEMINI_API_KEY
 */

const GEMINI_API_URL = process.env.GEMINI_API_URL;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function callGeminiRaw(prompt, options = {}) {
  if (!GEMINI_API_URL || !GEMINI_API_KEY) {
    throw new Error('GEMINI_API_URL, GEMINI_API_KEY 필요');
  }

  // Google Gemini 공식 요청 포맷
  const body = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ],
    generationConfig: {
      maxOutputTokens: options.maxTokens || 800,
      temperature: options.temperature ?? 0.0
    }
  };

  const resp = await axios.post(GEMINI_API_URL, body, {
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": GEMINI_API_KEY
    },
    timeout: 20000
  });

  return resp.data;
}

/** 내부 응답에서 텍스트만 추출 (공식 포맷 기준) */
function extractText(res) {
  const text =
    res?.candidates?.[0]?.content?.parts
      ?.map(p => p.text || '')
      .join('\n')
      .trim() || '';

  return text;
}

/** 쿼리 생성 */
export async function generateQueryWithGemini(prompt) {
  const res = await callGeminiRaw(prompt, {
    maxTokens: 400,
    temperature: 0.0
  });

  const text = extractText(res);
  const lines = text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  return lines.slice(0, 3).map(l => l.replace(/^[-\d.\)]\s*/, ''));
}

/** 문장 신뢰도 평가 */
export async function evaluateCredibilityWithGemini(prompt, sentences) {
  const res = await callGeminiRaw(prompt, {
    maxTokens: 1200,
    temperature: 0.0
  });

  const text = extractText(res);

  // JSON 배열을 강제하도록 프롬프트 설계했을 것을 가정
  try {
    const pos = text.indexOf('[');
    const jsonText = pos >= 0 ? text.slice(pos) : text;
    const parsed = JSON.parse(jsonText);

    return parsed.map(p => ({
      index: p.index ?? null,
      sentence: p.sentence ?? sentences[p.index] ?? '',
      label: p.label ??
        (p.score >= 0.7 ? '높음' : p.score <= 0.35 ? '낮음' : '중간'),
      score: typeof p.score === 'number' ? p.score : parseFloat(p.score || 0),
      reasons: p.reasons || []
    }));
  } catch (err) {
    console.warn('evaluateCredibilityWithGemini JSON 파싱 실패 → fallback', err.message);

    // fallback: 모든 문장 중간 평가
    return sentences.map((s, i) => ({
      index: i,
      sentence: s,
      label: '중간',
      score: 0.5,
      reasons: []
    }));
  }
}