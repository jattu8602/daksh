"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function RequestSentScreen({ name, type }) {
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    if (type === "countdown" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown, type])

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-md mx-auto">
      {/* Status Bar */}
      <div className="flex justify-between items-center p-2 text-xs">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <span className="font-bold">•••</span>
          {/* Signal Icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 9.5C18 5.36 14.64 2 10.5 2C6.36 2 3 5.36 3 9.5C3 13.64 6.36 17 10.5 17C14.64 17 18 13.64 18 9.5Z" fill="black" />
            <path d="M10.5 20C9.67 20 9 20.67 9 21.5C9 22.33 9.67 23 10.5 23C11.33 23 12 22.33 12 21.5C12 20.67 11.33 20 10.5 20Z" fill="black" />
            <path d="M19.5 8C18.67 8 18 8.67 18 9.5C18 10.33 18.67 11 19.5 11C20.33 11 21 10.33 21 9.5C21 8.67 20.33 8 19.5 8Z" fill="black" />
          </svg>
          {/* Battery Icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M1 9C1 7.89543 1.89543 7 3 7H21C22.1046 7 23 7.89543 23 9V20C23 21.1046 22.1046 22 21 22H3C1.89543 22 1 21.1046 1 20V9Z" fill="black" />
            <path fillRule="evenodd" clipRule="evenodd" d="M5 4C5 2.89543 5.89543 2 7 2H17C18.1046 2 19 2.89543 19 4V7H5V4Z" fill="black" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center flex-1 p-8">
        {type === "countdown" ? (
          <motion.div
            className="w-32 h-32 rounded-full border-4 border-black flex items-center justify-center mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.span
              className="text-4xl font-bold"
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {countdown}
            </motion.span>
          </motion.div>
        ) : (
          <motion.div
            className="w-64 h-64 mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src="/images/no-response-illustration.png"
              alt="No response"
              className="w-full h-full object-contain"
            />
          </motion.div>
        )}

        <motion.h1
          className="text-2xl font-bold mb-4 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {type === "countdown" ? "Request Sent" : "Ooops! No Response"}
        </motion.h1>

        <motion.p
          className="text-center text-gray-600 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {name} didn’t respond please try requesting again or open a support ticket.
        </motion.p>

        <motion.div
          className="w-full"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Link href="/mobile/community">
            <motion.button
              className="w-full bg-black text-white py-3 rounded-md font-medium mb-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Request Again
            </motion.button>
          </Link>

          <Link href="#" className="block text-center text-black underline">
            Open a Ticket
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
