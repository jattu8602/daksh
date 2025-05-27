"use client"

import { ArrowLeft, Mic, Paperclip, Send, Info } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"

export default function GroupChat({ avatar, name, info, messages, inputValue, setInputValue, onSendMessage, groupProfileUrl }) {
  const [isInputFocused, setIsInputFocused] = useState(false)
  const messagesEndRef = useRef(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const messagesContainerRef = useRef(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Show "scroll to bottom" if not at bottom
  useEffect(() => {
    const handleScroll = () => {
      const container = messagesContainerRef.current
      if (container) {
        const { scrollTop, scrollHeight, clientHeight } = container
        setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100)
      }
    }
    const container = messagesContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto fixed inset-0">
      {/* Header - Fixed at top */}
      <motion.div
        className="flex items-center p-4 border-b border-gray-200 bg-white"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link href="/dashboard/community/school" className="text-black">
          <ArrowLeft size={24} />
        </Link>

        {/* Make group avatar and name clickable */}
        <Link href={groupProfileUrl || "/dashboard/community/group-profile"} className="flex items-center ml-3 flex-1">
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
            <img src={avatar || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-lg font-medium">{name}</h1>
            <p className="text-xs text-gray-500">{info}</p>
          </div>
        </Link>

        <div className="ml-auto">
          <Link href={groupProfileUrl || "/dashboard/community/group-profile"}>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-9 h-9 rounded-full flex items-center justify-center">
              <Info size={20} />
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Messages - Scrollable middle area */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 relative"
        ref={messagesContainerRef}
        style={{ scrollBehavior: "smooth" }}
      >
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {!message.isMe && (
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                  <img
                    src={message.sender?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(message.sender || "Unknown")}`}
                    alt={message.sender || "Unknown"}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <motion.div
                className={`max-w-[80%] rounded-2xl p-3 ${message.isMe ? "bg-blue-100 text-black rounded-tr-none" : "bg-gray-100 text-black rounded-tl-none"}`}
                initial={message.isNew ? { scale: 0.9 } : { scale: 1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {!message.isMe && message.sender && <p className="text-xs font-medium text-blue-600 mb-1">{message.sender}</p>}
                <p className="text-sm">{message.text}</p>
                <p className="text-[10px] text-gray-500 text-right mt-1">
                  {message.time || "Now"}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
        {showScrollButton && (
          <motion.button
            className="absolute bottom-4 right-4 bg-gray-800 text-white rounded-full p-2 shadow-lg"
            onClick={scrollToBottom}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </motion.button>
        )}
      </div>

      {/* Input - Fixed at bottom */}
      <motion.div
        className="p-3 border-t border-gray-200 bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className={`flex items-center bg-gray-100 rounded-full px-4 py-2 ${isInputFocused ? "ring-2 ring-blue-300" : ""}`}>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-gray-500 mr-2">
            <Paperclip size={20} />
          </motion.button>
          <input
            type="text"
            placeholder="Message..."
            className="flex-1 bg-transparent border-none outline-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            onKeyDown={(e) => e.key === "Enter" && onSendMessage()}
          />
          {inputValue ? (
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-blue-500 ml-2" onClick={onSendMessage}>
              <Send size={20} />
            </motion.button>
          ) : (
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-gray-500 ml-2">
              <Mic size={20} />
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
