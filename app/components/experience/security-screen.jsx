"use client"

import { ArrowLeft, ChevronRight, Globe } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function SecurityScreen() {
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
        <h1 className="text-lg font-medium text-center flex-1">Security</h1>
      </div>

      {/* Content */}
      <div className="flex flex-col px-4 py-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>

          <motion.div
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-3"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                <Globe size={20} />
              </div>
              <div>
                <p className="font-medium">February 14, 2025</p>
                <p className="text-gray-500 text-sm">Signed in</p>
                <p className="text-gray-500 text-sm">Google Chrome on Windows</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </motion.div>

          <motion.div
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-3"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                <Globe size={20} />
              </div>
              <div>
                <p className="font-medium">February 10, 2025</p>
                <p className="text-gray-500 text-sm">Signed in</p>
                <p className="text-gray-500 text-sm">Google Chrome on Windows</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-4">Password</h2>
          <p className="text-gray-700 mb-4">
            Your password was last updated on January 12, 2025. We recommend updating your password every 6 months.
          </p>

          <motion.button
            className="w-full bg-black text-white py-3 rounded-md font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            Update Password
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
