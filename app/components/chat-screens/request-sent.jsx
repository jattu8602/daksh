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
          <Link href="/dashboard/community/request-sent">
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
