'use client'

import { useState, useRef, useEffect } from 'react'
import BottomNav from '@/components/BottomNav'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function CheckPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    
    // 사용자 메시지 추가
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      })

      if (!response.ok) {
        throw new Error('API 요청 실패')
      }

      const data = await response.json()
      
      // AI 응답 추가
      setMessages(prev => [...prev,
      {
        role: 'assistant',
        content: `${data.response}\n\n### 출처\n${
        data.sources
          .slice(0, 5)
          .map((s: any) => `- ${s.title}: ${s.link}`)
          .join('\n')
        }`,
       }
      ])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: '오류가 발생했습니다. 다시 시도해주세요.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-gradient-to-b from-blue-50 to-white">
      {/* 헤더 */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
        <h1 className="text-xl font-bold text-center">🔍 신뢰도 검사</h1>
        <p className="text-xs text-center text-blue-100 mt-1">AI 기반 텍스트 신뢰도 분석</p>
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
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            } animate-fadeIn`}
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
