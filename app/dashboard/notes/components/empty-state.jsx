'use client'

import { motion } from 'framer-motion'

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <img
          src="/images/notes-illustration.png"
          alt="Create your first note"
          className="w-48 h-48 object-contain"
        />
      </motion.div>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-600 dark:text-gray-400 text-center text-lg"
      >
        Create your first note !
      </motion.p>
    </motion.div>
  )
}
