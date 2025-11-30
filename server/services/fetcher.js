import axios from 'axios';
import cheerio from 'cheerio';

/** 단순 URL 판정 */
export function isUrl(text) {
  try {
    const u = new URL(text);
    return !!u.protocol && (u.protocol === 'http:' || u.protocol === 'https:');
  } catch (e) {
    return false;
  }
}

/** 페이지의 주요 본문 텍스트를 추출 */
export async function fetchUrlText(url) {
  try {
    const res = await axios.get(url, { timeout: 10000, headers: { 'User-Agent': 'Mozilla/5.0 (compatible; bot/1.0)' }});
    const $ = cheerio.load(res.data);

    // 기본적인 추출 전략: article, main, [role=main] 우선, 아니면 p 태그들 합침
    const selectors = ['article', 'main', '[role=main]'];
    let text = '';
    for (const sel of selectors) {
      const el = $(sel);
      if (el.length) {
        el.find('script,style,noscript,iframe,header,footer').remove();
        text = el.text();
        if ((text || '').trim().length > 200) break;
      }
    }

    if (!text || text.trim().length < 200) {
      // fallback: p 태그들의 텍스트
      text = $('p').map((i, el) => $(el).text()).get().join('\n\n');
    }

    // 간단한 정리
    text = text.replace(/\s{2,}/g, ' ').trim();
    return text;
  } catch (err) {
    console.error('fetchUrlText error', err.message);
    return '';
  }
}