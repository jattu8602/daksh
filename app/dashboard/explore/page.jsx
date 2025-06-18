'use client'

import React, {
  useState,
  useEffect,
  useMemo,
  memo,
  lazy,
  Suspense,
} from 'react'
import { Search, Home, PlusSquare, Play, User } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
  PageLoader,
  ComponentLoader,
  SkeletonCard,
  GridSkeleton,
} from '@/components/ui/loading'
import { useRouter } from 'next/navigation'


// Memoized search item component for better performance
const SearchItem = memo(({ item, idx }) => (
  <motion.div
    className="relative aspect-square"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3, delay: 0.2 + idx * 0.02 }}
    whileHover={{ scale: 0.98 }}
  >
    <Image
      src={item.image}
      alt={`Result ${item.id}`}
      width={200}
      height={200}
      className="w-full h-full object-cover"
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyBYkYZmClCw/qDKIz5wLl5vCGJsQnR1SXKiFFrEIUKKYg/DM8hNFgE1LGnQhwPP1FmgN5/U4SPHD9qGfOOW0IKS3YiVb0ZLIQZE1ks7Uif20rVOp2jmlDjO8IjzJNSrYH2rJMKnNaC4MDQzj1zMRIKtOzq/0vUz+YOxGlXk3Wx8zQ5+3KOjJJKvKr/xAAfEAACAgIDAQEBAAAAAAAAAAABAgAREgMhMUFRYYH/2gAIAQEAAT8A3Y4C2yqEYqVDAMv3AsTQq2AxjBCkMrKgAZrQH8RofoFhb0mEYXOh1KjQFMqDcJM0qhYMh3jG2jOPw2KuMqKmM8iZHF1QIaXLFHUGOjKSDm4gZlhHYOFv/9k="
    />

    {item.type === 'video' && (
      <motion.div
        className="absolute top-2 right-2 bg-black bg-opacity-70 rounded-full w-6 h-6 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 + idx * 0.02 }}
      >
        <Play size={12} className="text-white" />
      </motion.div>
    )}

    {item.type === 'carousel' && (
      <motion.div
        className="absolute top-2 right-2 bg-black bg-opacity-70 rounded-full w-6 h-6 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 + idx * 0.02 }}
      >
        {/* Carousel SVG */}
      </motion.div>
    )}

    {item.hasQuestion && (
      <motion.div
        className="absolute top-2 right-2 bg-black bg-opacity-70 rounded-full w-6 h-6 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 + idx * 0.02 }}
      >
        <span className="text-white text-xs font-bold">?</span>
      </motion.div>
    )}
  </motion.div>
))

SearchItem.displayName = 'SearchItem'

export default function SearchScreen() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchValue, setSearchValue] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [itemsLoaded, setItemsLoaded] = useState(false)
  const router = useRouter()


  const tabs = [
    { id: 'all', name: 'All' },
    { id: 'posts', name: 'Posts' },
    { id: 'shots', name: 'Shots' },
    { id: 'videos', name: 'Videos' },
    { id: 'audios', name: 'Audios' },
    { id: 'docs', name: 'Docs' },
    { id: 'books', name: 'Books' },
  ]

  const searchItems = useMemo(
    () => [
      {
        id: '1',
        image: '/placeholder.svg?height=200&width=200',
        type: 'image',
      },
      {
        id: '2',
        image: '/placeholder.svg?height=200&width=200',
        type: 'image',
        hasQuestion: true,
      },
      {
        id: '3',
        image: '/placeholder.svg?height=200&width=200',
        type: 'image',
      },
      {
        id: '4',
        image: '/placeholder.svg?height=300&width=200',
        type: 'video',
      },
      {
        id: '5',
        image: '/placeholder.svg?height=200&width=200',
        type: 'image',
        hasQuestion: true,
      },
      {
        id: '6',
        image: '/placeholder.svg?height=200&width=200',
        type: 'image',
        hasQuestion: true,
      },
      {
        id: '7',
        image: '/placeholder.svg?height=200&width=200',
        type: 'image',
      },
      {
        id: '8',
        image: '/placeholder.svg?height=200&width=200',
        type: 'video',
      },
      {
        id: '9',
        image: '/placeholder.svg?height=200&width=200',
        type: 'image',
      },
      {
        id: '10',
        image: '/placeholder.svg?height=200&width=200',
        type: 'carousel',
      },
      {
        id: '11',
        image: '/placeholder.svg?height=200&width=200',
        type: 'image',
        hasQuestion: true,
      },
      {
        id: '12',
        image: '/placeholder.svg?height=200&width=200',
        type: 'video',
      },
      {
        id: '13',
        image: '/placeholder.svg?height=200&width=200',
        type: 'image',
      },
      {
        id: '14',
        image: '/placeholder.svg?height=200&width=200',
        type: 'image',
        hasQuestion: true,
      },
      {
        id: '15',
        image: '/placeholder.svg?height=200&width=200',
        type: 'video',
      },
      {
        id: '16',
        image: '/placeholder.svg?height=200&width=200',
        type: 'image',
      },
      {
        id: '17',
        image: '/placeholder.svg?height=200&width=200',
        type: 'image',
        hasQuestion: true,
      },
      {
        id: '18',
        image: '/placeholder.svg?height=200&width=200',
        type: 'video',
      },
    ],
    []
  )

  // Filtered search items based on active tab
  const filteredItems = useMemo(() => {
    if (activeTab === 'all') return searchItems
    return searchItems.filter((item) => {
      if (activeTab === 'videos') return item.type === 'video'
      if (activeTab === 'posts')
        return item.type === 'image' && !item.hasQuestion
      // Add other filtering logic as needed
      return searchItems
    })
  }, [searchItems, activeTab])

  // Simulate loading sequence
  useEffect(() => {
    const loadSequence = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setIsLoading(false)
      await new Promise((resolve) => setTimeout(resolve, 200))
      setItemsLoaded(true)
    }

    loadSequence()
  }, [])

  if (isLoading) {
    return <PageLoader message="Exploring content..." />
  }

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-md mx-auto">
      <div className="sticky top-0 z-10 bg-white pt-2 pb-2">
        {/* Search Bar */}
        <motion.div
          className="px-4 py-4" // Added vertical spacing
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div
            onClick={() => router.push('/dashboard/explore/search')}
            className="flex items-center gap-3 bg-gradient-to-r from-purple-100 via-white to-indigo-100 border border-gray-300 hover:border-purple-400 rounded-full px-4 py-2 shadow-sm cursor-pointer transition-all duration-300"
          >
            <Search size={20} className="text-purple-600" />
            <input
              type="text"
              placeholder="Search for content..."
              className="bg-transparent w-full placeholder:text-gray-500 text-sm focus:outline-none cursor-pointer"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              readOnly
            />
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="flex space-x-2 px-5 overflow-x-auto hide-scrollbar"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-purple-100 text-purple-600'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Search Results */}
      <div className="flex-1 overflow-auto mt-4">
        <ComponentLoader
          isLoading={!itemsLoaded}
          skeleton={<GridSkeleton items={18} />}
        >
          <motion.div
            className="grid grid-cols-3 gap-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {filteredItems.map((item, idx) => (
              <SearchItem key={item.id} item={item} idx={idx} />
            ))}
          </motion.div>
        </ComponentLoader>
      </div>
    </div>
  )
}
