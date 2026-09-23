'use client'

import dynamic from 'next/dynamic'

const ChatbotLazy = dynamic(
  () => import('@/components/chatbot').then((m) => m.Chatbot),
  { ssr: false },
)

export function ChatbotDeferred() {
  return <ChatbotLazy />
}
