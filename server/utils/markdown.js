/**
 * makeMarkdownResult: 프론트 또는 사용자에게 보여줄 Markdown 생성
 * - 원문(또는 URL)
 * - 생성된 쿼리
 * - 간단한 신뢰도 요약
 * - 문장별 색상(주석) 표시 (HTML spans or markdown with inline code)
 */
export function makeMarkdownResult({ input, sourceUrl, queries, searchResults, merged, visualization }) {
  const header = sourceUrl ? `## URL 분석: ${sourceUrl}\n` : `## 입력 텍스트 분석\n`;
  const querySection = `**생성된 검색 쿼리:**\n${queries.map((q,i)=>`${i+1}. ${q}`).join('\n')}\n`;
  const summary = `**요약 신뢰도:**\n- 총 문장: ${visualization.totalSentences}\n- 높음: ${visualization.labelCounts.높음}\n- 중간: ${visualization.labelCounts.중간}\n- 낮음: ${visualization.labelCounts.낮음}\n\n`;

  const sentenceSection = merged.map(m => {
    const colorTag = m.finalLabel === '높음' ? '🟢' : (m.finalLabel === '중간' ? '🟡' : '🔴');
    const reasons = (m.reasons || []).slice(0,3).map(r => `  - ${r}`).join('\n');
    return `${colorTag} **[${m.finalLabel}]** (${(m.finalScore*100).toFixed(0)}%)  \n> ${m.sentence}\n${reasons ? `**근거:**\n${reasons}\n` : ''}`;
  }).join('\n\n');

  const domainSection = `**도메인 신뢰도 샘플:**\n${Object.entries(visualization.domainScores || {}).slice(0,10).map(([d,s])=>`- ${d}: ${(s*100).toFixed(0)}%`).join('\n')}\n`;

  const searchSummary = `**검색 결과 일부 (쿼리별):**\n${searchResults.map((sr,i)=>`### Query ${i+1}: ${sr.query}\n${sr.results.slice(0,5).map((r,j)=>`${j+1}. [${r.title}](${r.link}) - ${r.snippet}`).join('\n')}\n`).join('\n')}`;

  // Markdown 최종
  return `${header}\n${querySection}\n${summary}\n${domainSection}\n---\n${sentenceSection}\n\n---\n${searchSummary}`;
}