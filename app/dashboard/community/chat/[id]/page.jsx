'use client'

import { useParams, useRouter } from 'next/navigation'
import ChatInterface from '@/components/chat-interface'
import { getChatData } from '@/lib/dummy-data'

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const chatId = params.id

  const chatData = getChatData(chatId)

  if (!chatData) {
    return <div>Chat not found</div>
  }

  return <ChatInterface chatData={chatData} onBack={() => router.back()} />
}
