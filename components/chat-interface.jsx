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
  const messagesEndRef = useRef < HTMLDivElement > null
  const router = useRouter()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
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
    <div className="h-screen bg-white max-w-sm mx-auto flex flex-col">
      {/* Status Bar - Sticky */}
      <div className="flex justify-between items-center p-4 text-sm font-medium bg-white border-b border-gray-100">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-black rounded-full"></div>
            <div className="w-1 h-3 bg-black rounded-full"></div>
            <div className="w-1 h-3 bg-black rounded-full"></div>
            <div className="w-1 h-3 bg-gray-300 rounded-full"></div>
          </div>
          <svg className="w-6 h-4" viewBox="0 0 24 16" fill="none">
            <rect
              x="2"
              y="3"
              width="20"
              height="10"
              rx="2"
              stroke="black"
              strokeWidth="1"
              fill="none"
            />
            <path d="M22 6v4" stroke="black" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* Header - Sticky */}
      <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
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
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div>
              <span className="font-medium">{chatData.name}</span>
              {chatData.isGroup && (
                <p className="text-xs text-gray-500">32 members</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Phone className="w-5 h-5 text-gray-600" />
          <Video className="w-5 h-5 text-gray-600" />
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </div>
      </div>

      {/* Messages - Scrollable Area */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
        style={{ scrollBehavior: 'smooth' }}
      >
        {messages.map((message, index) => {
          const showSenderInfo =
            chatData.isGroup &&
            message.sender === 'other' &&
            (index === 0 ||
              messages[index - 1].senderInfo?.id !== message.senderInfo?.id)

          return (
            <div key={message.id}>
              {/* Sender Info for Group Chats */}
              {showSenderInfo && message.senderInfo && (
                <div
                  className="flex items-center space-x-2 mb-1 cursor-pointer"
                  onClick={() => handleSenderClick(message.senderInfo)}
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
                  <span className="text-xs font-medium text-gray-700">
                    {message.senderInfo.name}
                  </span>
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : chatData.isGroup
                      ? 'bg-white text-black ml-8 shadow-sm'
                      : 'bg-white text-black shadow-sm'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user'
                        ? 'text-blue-100'
                        : 'text-gray-500'
                    }`}
                  >
                    {message.time}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - Sticky Bottom */}
      <div className="p-4 border-t bg-white shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={
                chatData.isGroup ? 'Message Official 10-B...' : 'Message...'
              }
              className="pr-12 rounded-full border-gray-300 bg-gray-50"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
          </div>
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
