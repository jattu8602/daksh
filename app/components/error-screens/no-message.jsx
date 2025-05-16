"use client"

import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function NoMessagesError() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center p-4 h-14">
        <Link href="#" className="text-black">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-lg font-medium text-center flex-1">Error</h1>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center flex-1 px-6">
        {/* Icon with animation */}
        <motion.div
          className="relative w-32 h-32 mb-8 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute inset-0 bg-gray-100 rounded-[40px]"
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.8, 1.05, 1] }}
            transition={{ duration: 0.8, times: [0, 0.7, 1] }}
          />
          <motion.div className="relative z-10">
            {/* Mailbox icon with animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="relative"
            >
              {/* Mailbox body */}
              <div className="w-12 h-8 bg-black rounded-sm" />

              {/* Mailbox pole */}
              <div className="w-1.5 h-10 bg-black absolute -bottom-8 left-5" />

              {/* Mailbox base */}
              <div className="w-8 h-1.5 bg-black absolute -bottom-8 left-2" />

              {/* Mailbox flag */}
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, 45, 0] }}
                transition={{ delay: 0.6, duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                className="absolute -right-1 top-1"
              >
                <div className="w-1 h-5 bg-white" />
                <div className="w-3 h-2 bg-white absolute top-0 right-0 rounded-sm" />
              </motion.div>

              {/* Envelope */}
              <motion.div
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: [-5, 5, -5], opacity: [1, 0.7, 1] }}
                transition={{ delay: 0.4, duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="absolute -left-4 top-0"
              >
                <div className="w-5 h-4 border-2 border-white rounded-sm" />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Text with animation */}
        <motion.h2
          className="text-xl font-semibold mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          No new messages
        </motion.h2>

        <motion.p
          className="text-center text-gray-600 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          Start conversation with your tutors and friends
        </motion.p>

        {/* Buttons with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="w-full max-w-xs space-y-3"
        >
          <Link
            href="#"
            className="w-full bg-black text-white py-3 rounded-md font-medium flex items-center justify-center"
          >
            Start conversation
          </Link>
          <Link href="#" className="w-full text-center text-black underline py-1">
            Go to chats
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
