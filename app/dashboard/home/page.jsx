'use client'

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react'
import Header from '@/components/component/Header'
import {
  ComponentLoader,
  SkeletonCard,
  SkeletonText,
} from '@/components/ui/loading'
// import { dummyPosts, followedUsersDummy } from './dummyDataFile'

// Lazy load components for better performance
import dynamic from 'next/dynamic'

// Lazy load heavy components
const Stories = dynamic(() => import('@/components/component/Stories'), {
  loading: () => <StoriesSkeleton />,
  ssr: false,
})

const Posts = dynamic(() => import('@/components/component/Posts'), {
  loading: () => <PostsSkeleton />,
  ssr: false,
})

// Local-storage keys and constants
const LOCAL_POSTS_KEY = 'feed_last_chunk'
const LOCAL_SCROLL_KEY = 'feed_scroll_position'
const POSTS_PER_PAGE = 6

// Helper to synchronously pull cached feed data before first render
function getInitialFeedData() {
  if (typeof window === 'undefined') {
    return { posts: [], page: 1, scroll: 0 }
  }

  try {
    // 1️⃣ Same-session restore
    const sessionPosts = JSON.parse(
      sessionStorage.getItem('feed_session_posts') || '[]'
    )
    const sessionScroll = Number(
      sessionStorage.getItem('feed_session_scroll') || 0
    )
    if (sessionPosts.length) {
      return {
        posts: sessionPosts,
        page: Math.floor(sessionPosts.length / POSTS_PER_PAGE) + 1,
        scroll: sessionScroll,
      }
    }

    // 2️⃣ Cached last chunk from previous sessions
    const savedPosts = JSON.parse(localStorage.getItem(LOCAL_POSTS_KEY) || '[]')
    const savedScroll = Number(localStorage.getItem(LOCAL_SCROLL_KEY) || 0)

    return {
      posts: savedPosts,
      page: savedPosts.length > 0 ? 2 : 1,
      scroll: savedScroll,
    }
  } catch (e) {
    console.error('Error parsing cached feed data', e)
    return { posts: [], page: 1, scroll: 0 }
  }
}

function getInitialStories() {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem('feed_stories_cache') || '[]')
  } catch {
    return []
  }
}

// Skeleton components for loading states
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
  // Pre-initialize with cached data to prevent loading states
  const initialFeed = useMemo(() => getInitialFeedData(), [])
  const initialStoriesData = useMemo(() => getInitialStories(), [])

  const [stories, setStories] = useState(initialStoriesData)
  const [followedUsers, setFollowedUsers] = useState([])
  const [likedPosts, setLikedPosts] = useState([])
  const [savedPosts, setSavedPosts] = useState([])

  const [activeModal, setActiveModal] = useState({ type: null, postId: null })

  // Feed state (previously from Redux)
  const [posts, setPosts] = useState(initialFeed.posts)
  const [page, setPage] = useState(initialFeed.page)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [scrollPosition, setScrollPos] = useState(initialFeed.scroll)
  const [isInitialized, setIsInitialized] = useState(false)

  // Centralized history management for modals
  useEffect(() => {
    const handlePopState = () => {
      // When user navigates back (e.g., swipe), close any active modal.
      setActiveModal({ type: null, postId: null })
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const openModal = useCallback(
    (type, postId = null) => {
      if (activeModal.type) return // Prevent opening multiple modals

      // Push a state to the history to handle back navigation
      window.history.pushState({ modal: type }, '', window.location.href)
      setActiveModal({ type, postId })
    },
    [activeModal.type]
  )

  const closeModal = useCallback(() => {
    // Go back in history, which triggers popstate and closes the modal
    window.history.back()
  }, [])

  useEffect(() => {
    if (error) {
      console.error('Error fetching posts:', error)
    }
  }, [error])

  // Helper to shuffle an array (for random feed order)
  const shuffle = useCallback((arr) => arr.sort(() => Math.random() - 0.5), [])

  // Fetch posts from API (6 at a time)
  const fetchPosts = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const res = await fetch(`/api/posts?page=${page}&limit=${POSTS_PER_PAGE}`)
      const data = await res.json()

      if (data.success) {
        const incoming = shuffle(data.data)

        // Remove duplicates if any
        const existingIds = new Set(posts.map((p) => p.id))
        const uniqueNew = incoming.filter((p) => !existingIds.has(p.id))

        setPosts((prev) => [...prev, ...uniqueNew])

        // Update paging info
        setPage((prev) => prev + 1)
        setHasMore(data.currentPage < data.totalPages)

        // Persist the last FULL chunk (6 posts) to localStorage
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
  }, [isLoading, hasMore, page, posts, shuffle])

  // On mount: if we already have cached posts, skip fetching; otherwise fetch first batch.
  useEffect(() => {
    let timeoutId

    // Mark as initialized immediately for better UX
    setIsInitialized(true)

    // Defer API calls slightly to allow smooth page transition
    if (posts.length === 0) {
      timeoutId = setTimeout(() => {
        fetchPosts()
      }, 100) // Small delay for smoother navigation
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  // Save full feed + scroll into sessionStorage whenever they change, so navigating away/back is instant.
  useEffect(() => {
    if (isInitialized) {
      sessionStorage.setItem('feed_session_posts', JSON.stringify(posts))
      sessionStorage.setItem('feed_session_scroll', scrollPosition)
    }
  }, [posts, scrollPosition, isInitialized])

  // Optimized toggle functions with useCallback
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

  const debounce = useCallback((func, delay) => {
    let timeoutId
    return (...args) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        func.apply(this, args)
      }, delay)
    }
  }, [])

  // Debounced scroll handler (persists to localStorage)
  const handleScroll = useCallback(
    debounce((position) => {
      setScrollPos(position)
      localStorage.setItem(LOCAL_SCROLL_KEY, position)
    }, 200),
    [debounce]
  )

  const handleFetchMorePosts = useCallback(() => {
    if (hasMore && !isLoading) {
      fetchPosts()
    }
  }, [hasMore, isLoading, fetchPosts])

  // Memoize story loading check
  const showStorySkeleton = useMemo(
    () => stories.length === 0 && !isInitialized,
    [stories.length, isInitialized]
  )

  // Memoize post loading check
  const showPostSkeleton = useMemo(
    () => posts.length === 0 && hasMore && !isInitialized,
    [posts.length, hasMore, isInitialized]
  )

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black max-w-md mx-auto">
      <Header />

      <Suspense fallback={<StoriesSkeleton />}>
        <ComponentLoader
          isLoading={showStorySkeleton}
          skeleton={<StoriesSkeleton />}
        >
          <Stories
            stories={stories}
            onStoryClick={openModal}
            activeModal={activeModal}
            closeModal={closeModal}
          />
        </ComponentLoader>
      </Suspense>

      <Suspense fallback={<PostsSkeleton />}>
        <ComponentLoader
          isLoading={showPostSkeleton}
          skeleton={<PostsSkeleton />}
        >
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
        </ComponentLoader>
      </Suspense>
    </div>
  )
}
