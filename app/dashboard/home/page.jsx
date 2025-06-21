'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
// ✅ Normal import — now you can use it anywhere
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
  const [posts, setPosts] = useState([])
  const [stories, setStories] = useState([])
  const [followedUsers, setFollowedUsers] = useState([])
  const [likedPosts, setLikedPosts] = useState([])
  const [savedPosts, setSavedPosts] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const [activeModal, setActiveModal] = useState({ type: null, postId: null })

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

  const fetchPosts = async () => {
    if (isLoading || !hasMore) return
    setIsLoading(true)

    try {
      const response = await axios.get(`/api/posts?page=${page}&limit=4`)
      if (response.data.success && response.data.data.length > 0) {
        const newPosts = response.data.data
        setPosts((prevPosts) => {
          const existingIds = new Set(prevPosts.map((p) => p.id))
          const uniqueNewPosts = newPosts.filter((p) => !existingIds.has(p.id))
          return [...prevPosts, ...uniqueNewPosts]
        })

        const currentPage = response.data.currentPage
        setPage(currentPage + 1)
        setHasMore(currentPage < response.data.totalPages)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
      setHasMore(false) // Stop trying if there's an error
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch stories (or other initial data)
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

    fetchInitialData()
    fetchPosts() // Fetch initial batch of posts
  }, []) // Empty dependency array ensures this runs only once on mount

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
        isLoading={posts.length === 0}
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
          fetchMorePosts={fetchPosts}
          hasMore={hasMore}
          isLoading={isLoading}
        />
      </ComponentLoader>
    </div>
  )
}
