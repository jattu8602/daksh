'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
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
    text: 'That’s so true! Reading clears my mind every time. 🤯📖',
    sender: 'me',
    time: '1h',
    likes: 500,
    liked: true,
    name: 'me',
  },
  {
    id: 3,
    text: 'Just finished "Atomic Habits"—mind-blowing stuff! 💥🔥',
    sender: 'other',
    time: '55m',
    likes: 12500,
    liked: false,
    name: 'ankur.kumar_12',
  },
  {
    id: 4,
    text: 'Need to start that one soon. Everyone’s recommending it!',
    sender: 'me',
    time: '53m',
    likes: 200,
    liked: false,
    name: 'me',
  },
  {
    id: 5,
    text: 'Do you guys read fiction or non-fiction more?',
    sender: 'other',
    time: '50m',
    likes: 320,
    liked: false,
    name: 'megha.patil_21',
  },
  {
    id: 6,
    text: 'Non-fiction mostly. But I do enjoy thrillers sometimes 😄',
    sender: 'me',
    time: '48m',
    likes: 135,
    liked: true,
    name: 'me',
  },
  {
    id: 7,
    text: 'Same here. Fiction gives a break from the routine. 🚀',
    sender: 'other',
    time: '45m',
    likes: 845,
    liked: false,
    name: 'rahul.verma_44',
  },
  {
    id: 8,
    text: 'Guys, have you tried audiobooks? Total game changer! 🎧',
    sender: 'other',
    time: '43m',
    likes: 1100,
    liked: false,
    name: 'neha.kaur_16',
  },
  {
    id: 9,
    text: 'Yes! Perfect for while jogging or doing chores. 🔁🏃‍♂️',
    sender: 'me',
    time: '41m',
    likes: 420,
    liked: false,
    name: 'me',
  },
  {
    id: 10,
    text: 'Okay brb, ordering my next read 😄📦',
    sender: 'other',
    time: '39m',
    likes: 90,
    liked: false,
    name: 'ranveer.singh_9',
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
      setMessages([newMsg, ...messages])
      setNewMessage('')
    }
  }

  const handleLike = (id) => {
    setMessages((msgs) =>
      msgs.map((msg) =>
        msg.id === id
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
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-3 group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {msg.sender === 'user' ? 'S' : 'Y'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{msg.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {msg.time}
                  </span>
                </div>
                <div className="text-sm text-gray-900 dark:text-white break-words whitespace-pre-wrap max-w-[90%] sm:max-w-full">
                  {msg.text}
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleLike(msg.id)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
                    msg.liked
                      ? 'text-red-500 bg-red-50 dark:bg-red-900/30'
                      : 'text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${msg.liked ? 'fill-current' : ''}`}
                  />
                  <span>{formatLikes(msg.likes)}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Reactions */}
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-800">
          <div className="flex gap-2 overflow-x-auto">
            {reactions.map((reaction, i) => (
              <button
                key={i}
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
            {emojiLibrary.map((emoji, i) => (
              <button
                key={i}
                onClick={() => handleEmojiSelect(emoji)}
                className="text-xl hover:scale-110 transition-transform p-2 rounded flex items-center justify-center"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-2 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Add a comment"
                rows={2}
                className="w-full h-[40px] resize-none overflow-hidden pl-6 pr-10 py-2 text-sm rounded-full border border-gray-300 dark:border-gray-700 dark:bg-[#111] dark:text-white focus:border-blue-500 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
              />

              <div className="absolute right-3 top-1 bottom-3 flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-0 transition-transform duration-300 ease-in-out"
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                >
                  <div
                    className={`transition-transform duration-300 ${
                      showEmojiPicker ? 'rotate-180' : 'rotate-0'
                    }`}
                  >
                    {showEmojiPicker ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <Smile className="w-4 h-4" />
                    )}
                  </div>
                </Button>
              </div>
            </div>

            <Button
              onClick={handleSend}
              size="icon"
              className="rounded-full bg-blue-500 text-white hover:bg-blue-600 h-10 w-10 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
