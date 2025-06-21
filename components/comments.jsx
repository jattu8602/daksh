'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Send, Smile, Paperclip } from 'lucide-react'

const messages = [
  {
    id: 1,
    text: 'Books are the best friends.',
    sender: 'other',
    time: '2h',
    hashtags: ['#hardwork', '#studymotivation'],
  },
  { id: 2, text: 'Very nice sir', sender: 'user', time: '25m', liked: true },
  { id: 3, text: 'True that', sender: 'other', time: '2h' },
  { id: 4, text: 'correct', sender: 'other', time: '3h' },
  { id: 5, text: 'nice sir', sender: 'other', time: '3h' },
  { id: 6, text: 'correct sir', sender: 'other', time: '4h' },
  { id: 7, text: 'True that', sender: 'other', time: '5h' },
]

const reactions = ['👍', '🔥', '🎯', '😎', '⭐', '🙌', '👑', '💪']

export default function Comments({ onClose }) {
  const [newMessage, setNewMessage] = useState('')

  const handleSend = () => {
    if (newMessage.trim()) {
      // Handle sending message
      setNewMessage('')
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[99]" onClick={onClose} />

      {/* Chat Frame */}
      <div className="fixed bottom-0 left-0 right-0 bg-background text-foreground rounded-t-3xl z-[100] max-h-[70vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/placeholder.svg?height=40&width=40"
              alt="User"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="font-medium">sachin.sir_history</div>
              <div className="text-sm text-muted-foreground">
                Books are the best friends.
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start gap-3">
              <img
                src="/placeholder.svg?height=32&width=32"
                alt="User"
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">
                    {message.sender === 'user'
                      ? 'sumit.singh_22'
                      : 'yash.singhla_20'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {message.time}
                  </span>
                  {message.liked && <span className="text-red-500">❤️</span>}
                </div>
                <div className="text-sm text-foreground">
                  {message.text}
                  {message.hashtags && (
                    <div className="mt-1">
                      {message.hashtags.map((tag, index) => (
                        <span key={index} className="text-primary mr-2">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reactions */}
        <div className="px-4 py-2 border-t border-border">
          <div className="flex gap-2 overflow-x-auto">
            {reactions.map((reaction, index) => (
              <button
                key={index}
                className="text-2xl hover:scale-110 transition-transform flex-shrink-0"
              >
                {reaction}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Add a comment"
                className="pr-20 rounded-full"
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Smile className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Paperclip className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Button
              onClick={handleSend}
              size="icon"
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
