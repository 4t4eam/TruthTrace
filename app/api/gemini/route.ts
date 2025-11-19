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

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API 키가 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    // Gemini API 호출
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
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
                  text: `다음 텍스트의 신뢰도를 평가해주세요. 신뢰도를 0-100점 척도로 평가하고, 그 이유를 간단히 설명해주세요. 사실 확인이 가능한 주장인지, 편향되거나 왜곡된 정보는 없는지, 출처가 명확한지 등을 고려해주세요.\n\n텍스트: "${message}"`,
                },
              ],
            },
          ],
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Gemini API 오류:', errorData)
      return NextResponse.json(
        { error: 'Gemini API 요청 실패' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Gemini API 응답에서 텍스트 추출
    const generatedText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      '응답을 생성할 수 없습니다.'

    return NextResponse.json({ response: generatedText })
  } catch (error) {
    console.error('서버 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}