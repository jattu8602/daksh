"use client"

import { ArrowLeft, Home, Search, BookOpen, LayoutGrid, User, Award } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

export default function FreudScoreScreen() {
  return (
    <div className="flex flex-col min-h-screen bg-white max-w-md mx-auto">
      {/* Status Bar */}
      <div className="flex justify-between items-center p-2 text-xs">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <span className="font-bold">•••</span>
          <span>
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
      <div className="flex items-center p-4">
        <Link href="#" className="text-black">
          <ArrowLeft size={24} />
        </Link>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center flex-1 px-6 bg-green-50">
        {/* Illustration */}
        <motion.div
          className="w-full h-64 relative mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src="/images/freud-score-illustration.png"
            alt="Freud score illustration"
            fill
            style={{ objectFit: "contain" }}
          />

          {/* Animated sparkles */}
          <motion.div
            className="absolute top-10 left-10 w-3 h-3 text-green-600"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            ✦
          </motion.div>

          <motion.div
            className="absolute top-20 right-20 w-3 h-3 text-green-600"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              delay: 0.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            ✦
          </motion.div>

          <motion.div
            className="absolute bottom-10 left-20 w-3 h-3 text-green-600"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.8,
              delay: 0.8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            ✦
          </motion.div>
        </motion.div>

        {/* Text with animation */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <motion.h2
            className="text-5xl font-bold mb-2"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, duration: 0.3, type: "spring" }}
          >
            +8
          </motion.h2>

          <motion.p
            className="text-xl font-semibold mb-2"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            Freud Score Increased
          </motion.p>

          <motion.p
            className="text-gray-600 mb-4"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            You're <span className="text-green-500 font-medium">26% happier</span> compare to last month Congrats!
          </motion.p>

          {/* Score display */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.3 }}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-gray-600">Score Now:</span>
              <motion.div
                className="px-3 py-1 bg-green-100 rounded-full text-green-800 font-medium"
                initial={{ scale: 0.9 }}
                animate={{ scale: [0.9, 1.1, 1] }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                88.2
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Button with animation */}
        <motion.div
          className="w-full"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <motion.button
            className="w-full bg-black text-white py-3 rounded-full font-medium flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Award size={18} />
            See Score
          </motion.button>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <motion.div
        className="flex justify-between items-center p-4 border-t border-gray-100"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.4 }}
      >
        <Link href="#" className="flex flex-col items-center">
          <Home size={20} />
        </Link>
        <Link href="#" className="flex flex-col items-center">
          <Search size={20} />
        </Link>
        <Link href="#" className="flex flex-col items-center">
          <BookOpen size={20} />
        </Link>
        <Link href="#" className="flex flex-col items-center">
          <LayoutGrid size={20} />
        </Link>
        <Link href="#" className="flex flex-col items-center">
          <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center overflow-hidden">
            <User size={14} />
          </div>
        </Link>
      </motion.div>
    </div>
  )
}
