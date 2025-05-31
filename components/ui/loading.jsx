import React from 'react'
import { motion } from 'framer-motion'

// Simple spinner loading component
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  return (
    <motion.div
      className={`inline-block border-2 border-gray-200 border-t-blue-600 rounded-full ${sizeClasses[size]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  )
}

// Skeleton loading for cards
export const SkeletonCard = ({ className = '' }) => (
  <motion.div
    className={`bg-gray-200 rounded-lg ${className}`}
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
  />
)

// Skeleton loading for text
export const SkeletonText = ({ lines = 1, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <motion.div
        key={i}
        className="h-4 bg-gray-200 rounded"
        style={{ width: `${Math.random() * 40 + 60}%` }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: i * 0.1,
        }}
      />
    ))}
  </div>
)

// Full page loading component
export const PageLoader = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-white">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="text-center"
    >
      <Spinner size="lg" className="mb-4" />
      <motion.p
        className="text-gray-600 font-medium"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {message}
      </motion.p>
    </motion.div>
  </div>
)

// Grid skeleton for explore page
export const GridSkeleton = ({ items = 9 }) => (
  <div className="grid grid-cols-3 gap-[2px]">
    {Array.from({ length: items }).map((_, i) => (
      <SkeletonCard key={i} className="aspect-square" />
    ))}
  </div>
)

// Component loading wrapper
export const ComponentLoader = ({ isLoading, children, skeleton = null }) => {
  if (isLoading) {
    return skeleton || <Spinner className="mx-auto my-4" />
  }
  return children
}
