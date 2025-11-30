import axios from 'axios';

/**
 * serpapi 호출 예시 (Google Search)
 * 환경변수: SERPAPI_KEY
 * 반환: [{title, snippet, link}, ...]
 */
const SERPAPI_KEY = process.env.SERPAPI_KEY;

export async function serpSearch(query, num = 10) {
  if (!SERPAPI_KEY) throw new Error('SERPAPI_KEY 필요');
  try {
    // SerpApi Google Search example: https://serpapi.com/search
    const params = {
      q: query,
      api_key: SERPAPI_KEY,
      engine: 'google',
      num
    };
    const resp = await axios.get('https://serpapi.com/search.json', { params, timeout: 8000 });
    const organic = resp.data.organic_results || resp.data.orgicals || [];
    // map to common fields
    const mapped = (organic || []).slice(0, num).map(r => ({
      title: r.title || r.positionTitle || '',
      snippet: r.snippet || r.snippet_text || r.excerpt || '',
      link: r.link || r.url || r.source || '',
    }));
    return mapped;
  } catch (err) {
    console.error('serpSearch error', err.message);
    return [];
  }
}