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
      {/* Status Bar */}
      <div className="flex justify-between items-center p-2 text-xs">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <span className="font-bold">•••</span>
          <span>
            {/* Signal Icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18 9.5C18 5.36 14.64 2 10.5 2C6.36 2 3 5.36 3 9.5C3 13.64 6.36 17 10.5 17C14.64 17 18 13.64 18 9.5Z"
                fill="black"
              />
              <path
                d="M10.5 20C9.67 20 9 20.67 9 21.5C9 22.33 9.67 23 10.5 23C11.33 23 12 22.33 12 21.5C12 20.67 11.33 20 10.5 20Z"
                fill="black"
              />
              <path
                d="M19.5 8C18.67 8 18 8.67 18 9.5C18 10.33 18.67 11 19.5 11C20.33 11 21 10.33 21 9.5C21 8.67 20.33 8 19.5 8Z"
                fill="black"
              />
            </svg>
          </span>
          <span>
            {/* Battery Icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1 9C1 7.89543 1.89543 7 3 7H21C22.1046 7 23 7.89543 23 9V20C23 21.1046 22.1046 22 21 22H3C1.89543 22 1 21.1046 1 20V9Z"
                fill="black"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5 4C5 2.89543 5.89543 2 7 2H17C18.1046 2 19 2.89543 19 4V7H5V4Z"
                fill="black"
              />
            </svg>
          </span>
        </div>
      </div>

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
