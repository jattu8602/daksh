'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Header from '@/components/component/Header'
import {
  ComponentLoader,
  SkeletonCard,
  SkeletonText,
} from '@/components/ui/loading'

// Import components directly for instant loading (no dynamic imports)
import Stories from '@/components/component/Stories'
import Posts from '@/components/component/Posts'

// Local-storage keys and constants
const LOCAL_POSTS_KEY = 'feed_last_chunk'
const LOCAL_SCROLL_KEY = 'feed_scroll_position'
const POSTS_PER_PAGE = 6

// Pre-load all data synchronously before component renders
function initializeAppData() {
  if (typeof window === 'undefined') {
    return {
      posts: [],
      page: 1,
      scroll: 0,
      stories: [],
      initialized: false,
    }
  }

  try {
    // 1️⃣ Load posts from session/localStorage
    let posts = []
    let page = 1
    let scroll = 0

    const sessionPosts = JSON.parse(
      sessionStorage.getItem('feed_session_posts') || '[]'
    )
    const sessionScroll = Number(
      sessionStorage.getItem('feed_session_scroll') || 0
    )

    if (sessionPosts.length) {
      posts = sessionPosts
      page = Math.floor(sessionPosts.length / POSTS_PER_PAGE) + 1
      scroll = sessionScroll
    } else {
      const savedPosts = JSON.parse(
        localStorage.getItem(LOCAL_POSTS_KEY) || '[]'
      )
      const savedScroll = Number(localStorage.getItem(LOCAL_SCROLL_KEY) || 0)
      posts = savedPosts
      page = savedPosts.length > 0 ? 2 : 1
      scroll = savedScroll
    }

    // 2️⃣ Load stories from localStorage
    const stories = JSON.parse(
      localStorage.getItem('feed_stories_cache') || '[]'
    )

    return {
      posts,
      page,
      scroll,
      stories,
      initialized: true,
    }
  } catch (e) {
    console.error('Error loading cached data:', e)
    return {
      posts: [],
      page: 1,
      scroll: 0,
      stories: [],
      initialized: true,
    }
  }
}

// Skeleton components for loading states (only used for truly empty states)
const StoriesSkeleton = () => (
  <div className="flex space-x-3 p-4 overflow-x-auto">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex-shrink-0">
        <SkeletonCard className="w-16 h-16 rounded-full mb-2" />
        <SkeletonText lines={1} className="w-12" />
      </div>
    ))}
  </div>
)

const PostsSkeleton = () => (
  <div className="space-y-6 p-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="space-y-3">
        <div className="flex items-center space-x-3">
          <SkeletonCard className="w-10 h-10 rounded-full" />
          <SkeletonText lines={1} className="flex-1" />
        </div>
        <SkeletonCard className="w-full h-64" />
        <SkeletonText lines={2} />
      </div>
    ))}
  </div>
)

export default function FeedScreen() {
  // Initialize all data synchronously for instant rendering
  const appData = useMemo(() => initializeAppData(), [])

  // State initialized with cached data - no loading states needed
  const [stories] = useState(appData.stories)
  const [followedUsers] = useState([])
  const [likedPosts, setLikedPosts] = useState([])
  const [savedPosts, setSavedPosts] = useState([])
  const [activeModal, setActiveModal] = useState({ type: null, postId: null })

  // Feed state
  const [posts, setPosts] = useState(appData.posts)
  const [page, setPage] = useState(appData.page)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [scrollPosition, setScrollPos] = useState(appData.scroll)

  // Minimal modal history management
  useEffect(() => {
    const handlePopState = () => setActiveModal({ type: null, postId: null })
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Optimized modal functions
  const openModal = useCallback(
    (type, postId = null) => {
      if (activeModal.type) return
      window.history.pushState({ modal: type }, '', window.location.href)
      setActiveModal({ type, postId })
    },
    [activeModal.type]
  )

  const closeModal = useCallback(() => window.history.back(), [])

  // Optimized fetch function
  const fetchPosts = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const res = await fetch(`/api/posts?page=${page}&limit=${POSTS_PER_PAGE}`)
      const data = await res.json()

      if (data.success) {
        // Simple randomization without heavy shuffle
        const incoming = data.data.sort(() => Math.random() - 0.5)
        const existingIds = new Set(posts.map((p) => p.id))
        const uniqueNew = incoming.filter((p) => !existingIds.has(p.id))

        setPosts((prev) => [...prev, ...uniqueNew])
        setPage((prev) => prev + 1)
        setHasMore(data.currentPage < data.totalPages)

        if (uniqueNew.length === POSTS_PER_PAGE) {
          localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(uniqueNew))
        }
      } else {
        setHasMore(false)
      }
    } catch (err) {
      setError(err.message)
      setHasMore(false)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, hasMore, page, posts])

  // Deferred initialization - only fetch if no cached data
  useEffect(() => {
    if (appData.initialized && posts.length === 0) {
      // Use requestIdleCallback for non-critical fetch
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => fetchPosts())
      } else {
        setTimeout(fetchPosts, 50)
      }
    }
  }, [appData.initialized, posts.length, fetchPosts])

  // Session storage persistence (throttled)
  useEffect(() => {
    if (appData.initialized) {
      const timeoutId = setTimeout(() => {
        sessionStorage.setItem('feed_session_posts', JSON.stringify(posts))
        sessionStorage.setItem('feed_session_scroll', scrollPosition)
      }, 200)
      return () => clearTimeout(timeoutId)
    }
  }, [posts, scrollPosition, appData.initialized])

  // Optimized handlers
  const toggleLike = useCallback((postId) => {
    setLikedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    )
  }, [])

  const toggleSave = useCallback((postId) => {
    setSavedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    )
  }, [])

  // Optimized scroll handler with throttling
  const handleScroll = useCallback((position) => {
    setScrollPos(position)
    // Throttle localStorage writes
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        localStorage.setItem(LOCAL_SCROLL_KEY, position)
      })
    }
  }, [])

  const handleFetchMorePosts = useCallback(() => {
    if (hasMore && !isLoading) fetchPosts()
  }, [hasMore, isLoading, fetchPosts])

  // Only show skeletons for truly empty states (rare)
  const showStorySkeleton = stories.length === 0 && !appData.initialized
  const showPostSkeleton = posts.length === 0 && !appData.initialized

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black max-w-md mx-auto">
      <Header />

      {/* Stories - no ComponentLoader wrapper for better performance */}
      {showStorySkeleton ? (
        <StoriesSkeleton />
      ) : (
        <Stories
          stories={stories}
          onStoryClick={openModal}
          activeModal={activeModal}
          closeModal={closeModal}
        />
      )}

      {/* Posts - no ComponentLoader wrapper for better performance */}
      {showPostSkeleton ? (
        <PostsSkeleton />
      ) : (
        <Posts
          posts={posts}
          likedPosts={likedPosts}
          savedPosts={savedPosts}
          toggleLike={toggleLike}
          toggleSave={toggleSave}
          followedUsers={followedUsers}
          openModal={openModal}
          activeModal={activeModal}
          closeModal={closeModal}
          fetchMorePosts={handleFetchMorePosts}
          hasMore={hasMore}
          isLoading={isLoading}
          onScroll={handleScroll}
          scrollPosition={scrollPosition}
          storageKey={LOCAL_SCROLL_KEY}
        />
      )}
    </div>
  )
}
