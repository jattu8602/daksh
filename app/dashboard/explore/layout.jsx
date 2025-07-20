'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

export default function ExploreLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()

  const [searchText, setSearchText] = useState('')

  // Placeholder animation states
  const placeholders = [
    'Search for posts...',
    'Search for accounts...',
    'Search for shots...',
    'Search for videos...',
    'Search for playlists...',
    'Search NCERT content...',
    'Search docs...',
  ]
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [count, setCount] = useState(0)
  const phaseRef = useRef('countUp')
  const intervalRef = useRef(null)
  const [showCursor, setShowCursor] = useState(true)

  // Blinking cursor effect
  useEffect(() => {
    const blink = setInterval(() => setShowCursor((v) => !v), 500)
    return () => clearInterval(blink)
  }, [])

  // Typing animation for placeholder
  useEffect(() => {
    if (searchText) {
      setDisplayText('')
      return
    }

    if (intervalRef.current) clearInterval(intervalRef.current)

    const current = placeholders[placeholderIndex]
    phaseRef.current = 'countUp'
    setCount(0)

    intervalRef.current = setInterval(() => {
      setCount((c) => {
        if (phaseRef.current === 'countUp') {
          if (c < 100) {
            const pct = c + 3
            const len = Math.floor((pct / 100) * current.length)
            setDisplayText(current.slice(0, len))
            return pct
          } else {
            phaseRef.current = 'hold'
            setTimeout(() => {
              phaseRef.current = 'countDown'
            }, 1500)
            return c
          }
        } else if (phaseRef.current === 'hold') {
          return c
        } else {
          if (c > 0) {
            const pct = c - 3
            const len = Math.floor((pct / 100) * current.length)
            setDisplayText(current.slice(0, len))
            return pct
          } else {
            setPlaceholderIndex((idx) => (idx + 1) % placeholders.length)
            phaseRef.current = 'countUp'
            return 0
          }
        }
      })
    }, 50)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [searchText, placeholderIndex])

  const placeholderToShow =
    displayText + (showCursor && !searchText ? ' |' : '')

  const tabs = [
    { id: 'all', name: 'All', href: '/dashboard/explore' },
    { id: 'accounts', name: 'Accounts', href: '/dashboard/explore/accounts' },
    { id: 'posts', name: 'Posts', href: '/dashboard/explore/posts' },
    { id: 'shots', name: 'Shots', href: '/dashboard/explore/shots' },
    { id: 'videos', name: 'Videos', href: '/dashboard/explore/videos' },
    {
      id: 'playlists',
      name: 'Playlists',
      href: '/dashboard/explore/playlists',
    },
    { id: 'ncert', name: 'NCERT', href: '/dashboard/explore/ncert' },
    { id: 'docs', name: 'Docs', href: '/dashboard/explore/docs' },
  ]

  const activeTab = useMemo(() => {
    if (pathname === '/dashboard/explore') return 'all'
    const pathSegments = pathname.split('/')
    const lastSegment = pathSegments[pathSegments.length - 1]
    const currentTab = tabs.find((tab) => tab.id === lastSegment)
    return currentTab ? currentTab.id : 'all'
  }, [pathname, tabs])

  const handleSearchClick = () => {
    // Navigate to accounts page with search functionality
    if (searchText.trim()) {
      router.push(
        `/dashboard/explore/accounts?search=${encodeURIComponent(searchText.trim())}`
      )
    } else {
      router.push('/dashboard/explore/accounts')
    }
  }

  // Only update URL when on accounts page and search text changes
  useEffect(() => {
    const isOnAccountsPage = pathname.includes('/accounts')

    if (isOnAccountsPage && searchText.trim()) {
      // Update URL with search text when on accounts page
      router.push(
        `/dashboard/explore/accounts?search=${encodeURIComponent(searchText.trim())}`,
        { scroll: false }
      )
    } else if (isOnAccountsPage && !searchText.trim()) {
      // Clear search when on accounts page
      router.push('/dashboard/explore/accounts', { scroll: false })
    }
  }, [searchText, router, pathname])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchText.trim()) {
      router.push(
        `/dashboard/explore/accounts?search=${encodeURIComponent(searchText.trim())}`
      )
    }
  }

  const handleClearSearch = () => {
    setSearchText('')
  }

  return (
    <div
      className="flex flex-col min-h-screen bg-white dark:bg-black max-w-md mx-auto "
      style={{
        overscrollBehavior: 'contain',
        touchAction: 'pan-x pan-y',
      }}
    >
      <div className="sticky top-0 z-[9999] bg-white dark:bg-black pt-2 pb-2">
        {/* Search Bar */}
        <motion.div
          className="px-4 py-4 flex items-center justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSearchSubmit} className="flex flex-grow">
            <div className="flex flex-grow items-center gap-3 bg-gradient-to-r from-purple-100 via-white to-indigo-100 dark:from-purple-900 dark:via-black dark:to-indigo-900 border border-gray-300 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 rounded-full px-4 py-2 shadow-sm cursor-text transition-all duration-300">
              <Search
                size={20}
                className="text-purple-600 dark:text-purple-400"
              />
              <input
                type="text"
                placeholder={placeholderToShow}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onClick={handleSearchClick}
                className="bg-transparent w-full placeholder:text-gray-500 dark:placeholder:text-gray-400 text-sm focus:outline-none"
              />
              {searchText && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Tab Buttons */}
        <motion.div
          className="flex space-x-2 px-5 overflow-x-auto hide-scrollbar"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {tabs.map((tab) => (
            <Link href={tab.href} key={tab.id}>
              <motion.button
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.name}
              </motion.button>
            </Link>
          ))}
        </motion.div>
      </div>

      <main className="flex-1 overflow-auto ">{children}</main>
    </div>
  )
}
