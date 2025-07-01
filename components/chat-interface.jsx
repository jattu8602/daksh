'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Phone, Video, MoreVertical, Send } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function ChatInterface({ chatData, onBack }) {
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState(chatData.messages)
  const messagesEndRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'user',
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        senderInfo: chatData.isGroup
          ? {
              name: 'You',
              avatar: '/placeholder.svg?height=32&width=32',
              id: 'current_user',
            }
          : undefined,
      }
      setMessages([...messages, message])
      setNewMessage('')
    }
  }

  const handleProfileClick = () => {
    router.push(`/dashboard/community/profile/${chatData.id}`)
  }

  const handleSenderClick = (senderId) => {
    if (senderId !== 'current_user') {
      router.push(`/dashboard/community/profile/${senderId}`)
    }
  }

  return (
    <div className="relative h-screen bg-white dark:bg-black text-black dark:text-white overflow-hidden">
      {/* HEADER - fixed top */}
      <div className="fixed top-0 left-0 right-0 z-20 p-4 border-b bg-white dark:bg-black shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={handleProfileClick}
            >
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={chatData.avatar || '/placeholder.svg'}
                    alt={chatData.name}
                  />
                  <AvatarFallback>
                    {chatData.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                {chatData.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-black"></div>
                )}
              </div>
              <div>
                <span className="font-medium">{chatData.name}</span>
                {chatData.isGroup && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    32 members
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-300">
            <Phone className="w-5 h-5" />
            <Video className="w-5 h-5" />
            <MoreVertical className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* MESSAGE AREA */}
      <div
        className="overflow-y-auto bg-gray-50 dark:bg-zinc-900 px-4 py-3 space-y-4 mt-10"
        style={{
          paddingTop: '80px', // Header height
          paddingBottom: '80px', // Footer height
          height: '100%',
        }}
      >
        {messages.map((message, index) => {
          const showSenderInfo =
            chatData.isGroup &&
            message.sender === 'other' &&
            (index === 0 ||
              messages[index - 1].senderInfo?.id !== message.senderInfo?.id)

          return (
            <div key={message.id} className="space-y-1">
              {showSenderInfo && message.senderInfo && (
                <div
                  className="flex items-center space-x-2 mb-1 cursor-pointer ml-2"
                  onClick={() => handleSenderClick(message.senderInfo.id)}
                >
                  <Avatar className="w-6 h-6">
                    <AvatarImage
                      src={message.senderInfo.avatar || '/placeholder.svg'}
                      alt={message.senderInfo.name}
                    />
                    <AvatarFallback className="text-xs">
                      {message.senderInfo.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {message.senderInfo.name}
                  </span>
                </div>
              )}

              <div
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`relative max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-md ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-zinc-800 text-black dark:text-white rounded-bl-none'
                  }`}
                >
                  <p>{message.text}</p>
                  <span
                    className={`absolute bottom-1 right-3 text-xs ${
                      message.sender === 'user'
                        ? 'text-blue-200'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                    style={{ fontSize: '10px' }}
                  >
                    {message.time}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* FOOTER - fixed bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-20 p-4 bg-gray-50 dark:bg-zinc-900 ">
        <div className="flex items-center space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={
              chatData.isGroup ? 'Message Official 10-B...' : 'Message...'
            }
            className="pr-12 rounded-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white"
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button
            onClick={handleSendMessage}
            size="sm"
            className="rounded-full w-10 h-10 p-0 bg-blue-500 hover:bg-blue-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
