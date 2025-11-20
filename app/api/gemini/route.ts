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
    // 1) SerpAPI 검색
    //
    const serpRes = await fetch(
      `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(
        message
      )}&api_key=${SERPAPI_KEY}`
    )

    const serpData = await serpRes.json()
    const results = serpData.organic_results || []

    // 검색 결과 문자열 (LLM 입력용)
    const sourcesText = results
      .slice(0, 5)
      .map((item: any) => {
        return `- 제목: ${item.title}\n  URL: ${item.link}\n  요약: ${item.snippet || '요약 없음'}`
      })
      .join('\n')


    //
    // 2) Gemini 분석 요청
    //
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
다음 텍스트의 신뢰도를 평가하세요. 반드시 아래 검색 결과를 기반으로 판단하십시오.
마지막 부분에 표시하는 출처 목록이 아닌, 문장 중간에 삽입하는 출처는 다음과 같은 형식을 따라야 합니다.
링크 문법 예시:
이것은 다음의 출처를 참고한 문장.<sup>[1]</sup>
재활용<sup>[1]</sup>도 가능.
[1]: 여기에 링크 입력

[텍스트]
${message}

[검색 결과]
${sourcesText}

출력 형식:
1) 신뢰도 점수 (0~100)
2) 판단 근거
3) 참고한 출처 목록 (URL 포함)
                  `,
                },
              ],
            },
          ],
        }),
      }
    )

    const geminiData = await geminiRes.json()
    const generatedText =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text ||
      '응답을 생성할 수 없습니다.'

    //
    // 3) 전체 응답 반환
    //
    return NextResponse.json({
      response: generatedText,
      sources: results,
    })
  } catch (error) {
    console.error('서버 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
