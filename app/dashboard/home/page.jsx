'use client'

import { useState, useEffect, lazy, Suspense } from 'react'
import axios from 'axios'

import {
  PageLoader,
  ComponentLoader,
  SkeletonCard,
  SkeletonText,
} from '@/components/ui/loading'
// import { dummyPosts, followedUsersDummy } from './dummyDataFile'

// Lazy load components for better performance
const Stories = lazy(() => import('@/components/component/Stories'))
const Header = lazy(() => import('@/components/component/Header'))
const Posts = lazy(() => import('@/components/component/Posts'))

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

  // Fetch initial data
  useEffect(() => {
    const loadSequence = async () => {
      try {
        const [postsResponse, storiesData] = await Promise.all([
          axios.get('/api/posts'),
          Promise.resolve([
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
          ]),
        ])

        if (postsResponse.data.success) {
          setPosts(postsResponse.data.data)
        }
        setStories(storiesData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }

    loadSequence()
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

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black max-w-md mx-auto">
      <Suspense fallback={<PageLoader />}>
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
          />
        </ComponentLoader>
      </Suspense>
    </div>
  )
}
