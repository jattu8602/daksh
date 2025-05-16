"use client"

import { ArrowLeft, User } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function NoActivityError() {
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
          <motion.div className="relative z-10 flex items-center justify-center">
            <User size={40} className="text-black" />
            <motion.div
              className="absolute"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-black" />
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  <div className="w-10 h-0.5 bg-black rotate-45" />
                </div>
              </div>
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
          No Activity
        </motion.h2>

        <motion.p
          className="text-center text-gray-600 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          Oops! No activity here
        </motion.p>

        {/* Button with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="w-full max-w-xs"
        >
          <Link
            href="#"
            className="w-full bg-black text-white py-3 rounded-md font-medium flex items-center justify-center"
          >
            Go to homepage
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
