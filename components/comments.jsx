'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Send, Smile, Heart } from 'lucide-react'
import { emojiLibrary } from '@/constants/emojis'

const initialMessages = [
  {
    id: 1,
    text: 'Books are the best friends. You can open them anytime, anywhere. 📚❤️',
    sender: 'other',
    time: '2h',
    likes: 1000000,
    liked: false,
    name: 'ranveer.singh_9',
  },
  {
    id: 2,
    text: 'Wow!! Loved this!! 🔥🔥🔥',
    sender: 'user',
    time: '10m',
    likes: 2000,
    liked: true,
    name: 'nitesh.dev',
  },
  {
    id: 3,
    text: '💯',
    sender: 'other',
    time: '5m',
    likes: 999,
    liked: false,
    name: 'techqueen_01',
  },
  {
    id: 4,
    text: 'Totally agree with you!',
    sender: 'user',
    time: '1h',
    likes: 10000,
    liked: true,
    name: 'justin_02',
  },
  {
    id: 5,
    text: "That's deep... 🧠📖",
    sender: 'other',
    time: '3h',
    likes: 8000,
    liked: false,
    name: 'booknerd.x',
  },
  {
    id: 6,
    text: '👍',
    sender: 'other',
    time: '4h',
    likes: 2,
    liked: false,
    name: 'silent.reader',
  },
  {
    id: 7,
    text: 'I always say this to my students too. Learning from books is unmatched.',
    sender: 'other',
    time: '6h',
    likes: 650,
    liked: true,
    name: 'ankur.kumar_12',
  },
  {
    id: 8,
    text: '😂😂😂 agree!',
    sender: 'user',
    time: '7m',
    likes: 12000,
    liked: true,
    name: 'jatt_the_dev',
  },
  {
    id: 9,
    text: 'Too good!✨',
    sender: 'other',
    time: '15m',
    likes: 27000,
    liked: false,
    name: 'mystery.mind',
  },
  {
    id: 10,
    text: '👏👏👏',
    sender: 'user',
    time: '30m',
    likes: 1500,
    liked: false,
    name: 'coding.king',
  },
  {
    id: 11,
    text: 'Inspirational ❤️',
    sender: 'other',
    time: '1h',
    likes: 105,
    liked: true,
    name: 'the_reader',
  },
  {
    id: 12,
    text: 'Correct sir',
    sender: 'other',
    time: '2h',
    likes: 5,
    liked: false,
    name: 'user_009',
  },
  {
    id: 13,
    text: "I'm saving this message for life 💌",
    sender: 'user',
    time: '20m',
    likes: 7000,
    liked: true,
    name: 'crazy.writer',
  },
  {
    id: 14,
    text: 'Short msg ✅',
    sender: 'other',
    time: '3h',
    likes: 99,
    liked: false,
    name: 'fast.reply',
  },
  {
    id: 15,
    text: 'Noted.',
    sender: 'user',
    time: '12m',
    likes: 2000,
    liked: false,
    name: 'nitesh.js',
  },
]

const reactions = ['👍', '🔥', '🎯', '😎', '⭐', '🙌', '👑', '💪']

const formatLikes = (likes) => {
  if (likes >= 1_000_000)
    return (likes / 1_000_000).toFixed(1).replace('.0', '') + 'M'
  if (likes >= 1_000) return (likes / 1_000).toFixed(1).replace('.0', '') + 'k'
  return likes.toString()
}

export default function Comments({ onClose }) {
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState(initialMessages)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const handleSend = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: Date.now(),
        text: newMessage,
        sender: 'user',
        time: 'now',
        likes: 0,
        liked: false,
        name: 'sumit.singh_22',
      }
      setMessages([newMsg, ...messages]) // <-- this is the key change
      setNewMessage('')
    }
  }


  const handleLike = (messageId) => {
    setMessages(
      messages.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              liked: !msg.liked,
              likes: msg.liked ? msg.likes - 1 : msg.likes + 1,
            }
          : msg
      )
    )
  }

  const handleReactionClick = (reaction) => {
    setNewMessage((prev) => prev + reaction)
  }

  const handleEmojiSelect = (emoji) => {
    setNewMessage((prev) => prev + emoji)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[99]" onClick={onClose} />

      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black text-gray-900 dark:text-white rounded-t-3xl z-[100] max-h-[70vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              S
            </div>
            <div>
              <div className="font-medium">sachin.sir_history</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Books are the best friends.
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start gap-3 group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {message.sender === 'user' ? 'S' : 'Y'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{message.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {message.time}
                  </span>
                </div>
                <div className="text-sm text-gray-900 dark:text-white">
                  {message.text}
                </div>
              </div>

              {/* Like Button */}
              <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleLike(message.id)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
                    message.liked
                      ? 'text-red-500 bg-red-50 dark:bg-red-900/30'
                      : 'text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${message.liked ? 'fill-current' : ''}`}
                  />
                  <span>{formatLikes(message.likes)}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Reactions */}
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-800">
          <div className="flex gap-2 overflow-x-auto">
            {reactions.map((reaction, index) => (
              <button
                key={index}
                onClick={() => handleReactionClick(reaction)}
                className="text-2xl transition-transform flex-shrink-0 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {reaction}
              </button>
            ))}
          </div>
        </div>

        {/* Emoji Picker */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            showEmojiPicker ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          } overflow-y-auto`}
        >
          <div className="grid grid-cols-8 gap-1 p-2">
            {emojiLibrary.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiSelect(emoji)}
                className="text-xl hover:scale-110 transition-transform p-2 rounded flex items-center justify-center"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Add a comment"
                className="pr-12 rounded-full border-gray-300 dark:border-gray-700 dark:bg-[#111] dark:text-white focus:border-blue-500 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0"
                  style={{
                    transform: showEmojiPicker ? 'rotate(90deg)' : 'none',
                  }}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  {showEmojiPicker ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Smile className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button
              onClick={handleSend}
              size="icon"
              className="rounded-full bg-blue-500 text-white hover:bg-blue-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
