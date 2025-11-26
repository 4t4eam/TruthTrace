'use client'

import { useState, useRef, useEffect } from 'react'
import BottomNav from '@/components/BottomNav'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import jwt_decode from 'jwt-decode'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface JwtPayload {
  userId: string
  email: string
}

export default function CheckPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [hydrated, setHydrated] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  // Hydration & 초기 메시지 불러오기
  useEffect(() => {
    setHydrated(true)
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      setToken(savedToken)
      try {
        const payload: JwtPayload = jwt_decode(savedToken)
        setUserId(payload.userId)

        // 유저별 메시지 불러오기
        fetch('/api/chat', { headers: { 'x-user-id': payload.userId } })
          .then(res => res.json())
          .then(data => setMessages(data.messages || []))
          .catch(err => console.error(err))
      } catch (err) {
        console.error('JWT decode error:', err)
      }
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading || !userId) return

    const userMessage = input.trim()
    setInput('')

    const newMessages = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)
    setLoading(true)

    try {
      // AI 응답 호출
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      })
      if (!response.ok) throw new Error('API 요청 실패')

      const data = await response.json()
      const aiMessage = {
        role: 'assistant',
        content: `${data.response}\n\n### 출처\n${data.sources
          .slice(0, 5)
          .map((s: any) => `- ${s.title}: ${s.link}`)
          .join('\n')}`,
      }

      const updatedMessages = [...newMessages, aiMessage]
      setMessages(updatedMessages)

      // DB에 메시지 저장 (유저별)
      await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({ role: 'user', content: userMessage }),
      })
      await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({ role: 'assistant', content: aiMessage.content }),
      })
    } catch (error) {
      console.error(error)
      const errorMessage = { role: 'assistant', content: '오류가 발생했습니다. 다시 시도해주세요.' }
      setMessages([...newMessages, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  if (!hydrated) return null // SSR 시 초기 Hydration 방지

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-gradient-to-b from-blue-50 to-white">
      {/* 헤더 */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-center">🔍 신뢰도 검사</h1>
          <p className="text-xs text-center text-blue-100 mt-1">AI 기반 텍스트 신뢰도 분석</p>
        </div>
        <div className="ml-4">
          {token ? (
            <span title="로그인됨" className="text-green-400 text-lg">✅</span>
          ) : (
            <span title="로그인 필요" className="text-red-400 text-lg">❌</span>
          )}
        </div>
      </header>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-3">
        {messages.length === 0 && (
          <div className="text-center mt-20">
            <div className="bg-white rounded-2xl p-8 shadow-md mx-4">
              <div className="text-5xl mb-4">💬</div>
              <p className="text-gray-600 text-base font-medium">텍스트를 입력하여</p>
              <p className="text-gray-600 text-base font-medium">신뢰도를 검사하세요</p>
              <div className="mt-6 text-xs text-gray-400">
                <p>• 뉴스, SNS 게시물 등을 검증</p>
                <p>• AI가 신뢰도를 평가합니다</p>
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                  : 'bg-white text-gray-800 border border-gray-100'
              }`}
            >
              {msg.role === 'user' ? (
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {msg.content}
                </p>
              ) : (
                <div className="text-sm leading-relaxed prose prose-sm max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      strong: ({ children }) => <strong className="font-bold text-blue-600">{children}</strong>,
                      em: ({ children }) => <em className="italic text-gray-600">{children}</em>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="text-gray-700">{children}</li>,
                      code: ({ children }) => <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-blue-600">{children}</code>,
                      h1: ({ children }) => <h1 className="text-lg font-bold mb-2 text-gray-900">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-base font-bold mb-2 text-gray-900">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-sm font-bold mb-1 text-gray-900">{children}</h3>,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-fadeIn">
            <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-white text-gray-600 shadow-md border border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <p className="text-sm">검사 중입니다...</p>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="border-t border-gray-200 bg-white p-4 pb-24 shadow-lg">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="검사할 텍스트를 입력하세요..."
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm transition-colors bg-gray-50 focus:bg-white"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed hover:from-blue-700 hover:to-blue-800 transition-all shadow-md disabled:shadow-none active:scale-95"
          >
            {loading ? '⏳' : '전송'}
          </button>
        </form>
      </div>

      {/* 하단 네비게이션 */}
      <BottomNav />
    </div>
  )
}
