import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: '메시지가 필요합니다.' },
        { status: 400 }
      )
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY
    const SERPAPI_KEY = process.env.SERPAPI_KEY

    if (!GEMINI_API_KEY || !SERPAPI_KEY) {
      return NextResponse.json(
        { error: '필요한 API 키가 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    //
    // =========================================================================
    // 1) LLM에게 "검색 쿼리 생성" 요청
    // =========================================================================
    //
    const queryGenRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
사용자의 메시지를 가장 잘 설명하고,
사실 검증을 위해 적절한 구글 검색 쿼리를 한 문장으로 작성하세요.
검색 쿼리만 순수하게 출력하세요.

[사용자 메시지]
${message}
                  `
                }
              ]
            }
          ]
        })
      }
    )

    const queryGenData = await queryGenRes.json()
    const searchQuery =
      queryGenData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      message

    //
    // =========================================================================
    // 2) 생성된 검색 쿼리(searchQuery)로 SerpAPI 검색
    // =========================================================================
    //
    const serpRes = await fetch(
      `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(
        searchQuery
      )}&api_key=${SERPAPI_KEY}`
    )

    const serpData = await serpRes.json()
    const results = serpData.organic_results || []

    // LLM 입력용 요약
    const sourcesText = results
      .slice(0, 5)
      .map((item: any) => {
        return `- 제목: ${item.title}
  URL: ${item.link}
  요약: ${item.snippet || '요약 없음'}`
      })
      .join('\n')

    //
    // =========================================================================
    // 3) 검색 정보 + 원본 메시지로 최종 LLM 분석 요청
    // =========================================================================
    //
    const finalRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
다음 사용자 텍스트의 신뢰도를 분석하세요.
아래 검색 결과를 기반으로 판단하고,
논문/뉴스 등 신뢰도 있는 사이트를 우선적으로 고려하세요.
출처는 마지막에 한 번만 명시하세요.

[사용자 메시지]
${message}

[검색 쿼리]
${searchQuery}

[검색 결과]
${sourcesText}

출력 형식:
1) 신뢰도 점수 (0~100)
2) 판단 근거
3) 참고한 출처 목록 (URL 포함)
                  `
                }
              ]
            }
          ]
        })
      }
    )

    const finalData = await finalRes.json()
    const generatedText =
      finalData.candidates?.[0]?.content?.parts?.[0]?.text ||
      '응답을 생성할 수 없습니다.'

    //
    // 4) 전체 응답 반환
    //
    return NextResponse.json({
      searchQuery,
      response: generatedText,
      sources: results
    })
  } catch (error) {
    console.error('서버 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
