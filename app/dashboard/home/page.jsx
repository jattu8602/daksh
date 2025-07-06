'use client'

import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/component/Header'
import {
  ComponentLoader,
  SkeletonCard,
  SkeletonText,
} from '@/components/ui/loading'
// import { dummyPosts, followedUsersDummy } from './dummyDataFile'

// Lazy load components for better performance
import Stories from '@/components/component/Stories'
import Posts from '@/components/component/Posts'

// Local-storage keys and constants
const LOCAL_POSTS_KEY = 'feed_last_chunk'
const LOCAL_SCROLL_KEY = 'feed_scroll_position'
const POSTS_PER_PAGE = 6

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
  const [stories, setStories] = useState([])
  const [followedUsers, setFollowedUsers] = useState([])
  const [likedPosts, setLikedPosts] = useState([])
  const [savedPosts, setSavedPosts] = useState([])

  const [activeModal, setActiveModal] = useState({ type: null, postId: null })

  // Feed state (previously from Redux)
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [scrollPosition, setScrollPos] = useState(0)

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

  const openModal = (type, postId = null) => {
    if (activeModal.type) return // Prevent opening multiple modals

    // Push a state to the history to handle back navigation
    window.history.pushState({ modal: type }, '', window.location.href)
    setActiveModal({ type, postId })
  }

  const closeModal = () => {
    // Go back in history, which triggers popstate and closes the modal
    window.history.back()
  }

  useEffect(() => {
    if (error) {
      console.error('Error fetching posts:', error)
    }
  }, [error])

  // Helper to shuffle an array (for random feed order)
  const shuffle = (arr) => arr.sort(() => Math.random() - 0.5)

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
  }, [isLoading, hasMore, page, posts])

  // On mount: try restoring from sessionStorage first. If not present, use localStorage chunk, otherwise fetch.
  useEffect(() => {
    // 1️⃣ Same-session restore (navigate back)
    const sessionPosts = JSON.parse(
      sessionStorage.getItem('feed_session_posts') || '[]'
    )
    const sessionScroll = Number(
      sessionStorage.getItem('feed_session_scroll') || 0
    )

    if (sessionPosts.length > 0) {
      setPosts(sessionPosts)
      setPage(Math.floor(sessionPosts.length / POSTS_PER_PAGE) + 1)
      setHasMore(true)
      setScrollPos(sessionScroll)
      return
    }

    // 2️⃣ First visit in new session – show cached last chunk if any
    const savedPosts = JSON.parse(localStorage.getItem(LOCAL_POSTS_KEY) || '[]')
    const savedScroll = Number(localStorage.getItem(LOCAL_SCROLL_KEY) || 0)

    if (savedPosts.length > 0) {
      setPosts(savedPosts)
      setPage(2) // next API page when user scrolls
      setScrollPos(savedScroll)
    } else {
      // 3️⃣ Absolutely fresh – fetch first batch
      fetchPosts()
    }
  }, [])

  // Save full feed + scroll into sessionStorage whenever they change, so navigating away/back is instant.
  useEffect(() => {
    sessionStorage.setItem('feed_session_posts', JSON.stringify(posts))
    sessionStorage.setItem('feed_session_scroll', scrollPosition)
  }, [posts, scrollPosition])

  // Fetch stories (assuming this is local to the home page)
  useEffect(() => {
    const fetchStories = async () => {
      const storiesData = await Promise.resolve([
        {
          id: '1',
          username: 'justin',
          avatar: '/placeholder.png',
          hasStory: true,
          isWatched: false,
        },
        {
          id: '2',
          username: 'karenme',
          avatar: '/placeholder.png',
          hasStory: true,
          isWatched: true,
        },
        {
          id: '3',
          username: 'zackjohn',
          avatar: '/placeholder.png',
          hasStory: true,
          isWatched: false,
        },
        {
          id: '4',
          username: 'Starc',
          avatar: '/placeholder.png',
          hasStory: true,
          isWatched: true,
        },
        {
          id: '5',
          username: 'kiron_d',
          avatar: '/placeholder.png',
          hasStory: true,
          isWatched: false,
        },
        {
          id: '6',
          username: 'kiron_d',
          avatar: '/placeholder.png',
          hasStory: true,
          isWatched: false,
        },
      ])
      setStories(storiesData)
    }
    fetchStories()
  }, [])

  const toggleLike = (postId) => {
    setLikedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    )
  }

  const toggleSave = (postId) => {
    setSavedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    )
  }

  const debounce = (func, delay) => {
    let timeoutId
    return (...args) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        func.apply(this, args)
      }, delay)
    }
  }

  // Debounced scroll handler (persists to localStorage)
  const handleScroll = useCallback(
    debounce((position) => {
      setScrollPos(position)
      localStorage.setItem(LOCAL_SCROLL_KEY, position)
    }, 200),
    []
  )

  const handleFetchMorePosts = () => {
    if (hasMore && !isLoading) {
      fetchPosts()
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black max-w-md mx-auto">
      <Header />
      <ComponentLoader
        isLoading={stories.length === 0}
        skeleton={<StoriesSkeleton />}
      >
        <Stories
          stories={stories}
          onStoryClick={() => openModal('story')}
          activeModal={activeModal}
          closeModal={closeModal}
        />
      </ComponentLoader>

      <ComponentLoader
        isLoading={posts.length === 0 && hasMore}
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
    </div>
  )
}
