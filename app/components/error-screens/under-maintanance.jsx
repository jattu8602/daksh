"use client"

import { ArrowLeft, Wrench } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function UnderMaintenanceError() {
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
            {/* Tools icon */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="relative"
            >
              {/* Wrench */}
              <motion.div
                initial={{ rotate: -45, x: -5 }}
                animate={{ rotate: [-45, 0, -45], x: [-5, 0, -5] }}
                transition={{ delay: 0.4, duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
              >
                <Wrench size={32} className="text-black" />
              </motion.div>

              {/* Screwdriver */}
              <motion.div
                initial={{ rotate: 45, x: 5 }}
                animate={{ rotate: [45, 0, 45], x: [5, 0, 5] }}
                transition={{ delay: 0.4, duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
                className="absolute top-0 left-0"
              >
                <div className="w-1.5 h-10 bg-black rounded-sm" />
                <div className="w-4 h-1.5 bg-black rounded-sm -mt-1.5 ml-[calc(50%-0.75rem)]" />
              </motion.div>

              {/* Alert circle */}
              <motion.div
                className="absolute -right-3 -bottom-3 w-8 h-8 bg-black rounded-full flex items-center justify-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <span className="text-white font-bold text-lg">!</span>
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
          Under Maintenance
        </motion.h2>

        <motion.p
          className="text-center text-gray-600 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          Try after sometime
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
