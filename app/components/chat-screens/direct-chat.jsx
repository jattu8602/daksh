"use client"

import { ArrowLeft, Phone, Mic, Paperclip, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function DirectChat({ avatar, name, messages: initialMessages, isTyping = false }) {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const messagesEndRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesContainerRef = useRef(null);

  // Mark new messages as seen after they appear
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages(
        messages.map((message) => ({
          ...message,
          isNew: false,
        }))
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, [messages]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check if we should show the scroll button
  useEffect(() => {
    const handleScroll = () => {
      if (messagesContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        const isNotAtBottom = scrollHeight - scrollTop - clientHeight > 100;
        setShowScrollButton(isNotAtBottom);
      }
    };

    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputValue,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
        isNew: true,
      };
      setMessages([...messages, newMessage]);
      setInputValue("");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto">

      {/* Header */}
      <motion.div
        className="flex items-center p-4 border-b border-gray-200"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link href="/mobile/community" className="text-black">
          <ArrowLeft size={24} />
        </Link>
        <div className="flex items-center ml-3">
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
            <img src={avatar || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-lg font-medium">{name}</h1>
          </div>
        </div>
        <div className="ml-auto">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-full flex items-center justify-center"
          >
            <Phone size={20} />
          </motion.button>
        </div>
      </motion.div>

      {/* Messages */}
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
              <motion.div
                className={`max-w-[80%] rounded-2xl p-3 ${
                  message.isMe
                    ? "bg-blue-100 text-black rounded-tr-none"
                    : "bg-gray-100 text-black rounded-tl-none"
                }`}
                initial={message.isNew ? { scale: 0.9 } : { scale: 1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs text-gray-500 text-right mt-1">{message.time}</p>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            className="flex justify-start"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gray-100 rounded-2xl rounded-tl-none p-3 px-4 flex space-x-1">
              {[0, 150, 300].map((delay) => (
                <motion.div
                  key={delay}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: "loop", delay }}
                />
              ))}
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />

        {/* Scroll to bottom button */}
        {showScrollButton && (
          <motion.button
            className="absolute bottom-20 right-4 bg-gray-800 text-white rounded-full p-2 shadow-lg"
            onClick={scrollToBottom}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </motion.button>
        )}
      </div>

      {/* Input */}
      <motion.div
        className="p-3 border-t border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div
          className={`flex items-center bg-gray-100 rounded-full px-4 py-2 ${
            isInputFocused ? "ring-2 ring-blue-300" : ""
          }`}
        >
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
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          {inputValue ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-blue-500 ml-2"
              onClick={handleSendMessage}
            >
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
  );
}
