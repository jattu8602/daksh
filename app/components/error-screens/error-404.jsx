"use client"

import { AlertTriangle, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function Error404() {
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
            {/* 404 with warning triangle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="relative"
            >
              <div className="flex items-center">
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="text-3xl font-bold"
                >
                  4
                </motion.div>

                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="mx-1"
                >
                  <AlertTriangle size={28} className="text-black" />
                </motion.div>

                <motion.div
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="text-3xl font-bold"
                >
                  4
                </motion.div>
              </div>

              {/* Pulsing animation for the triangle */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ delay: 0.6, duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              >
                <div className="mx-1 opacity-0">
                  <AlertTriangle size={28} />
                </div>
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
          404 Error
        </motion.h2>

        <motion.p
          className="text-center text-gray-600 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          You unexpectedly landed in 404 page. Click here to go to home page
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
