'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchPosts, setScrollPosition } from '@/app/store/features/feedSlice'
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
  const dispatch = useDispatch()
  const { posts, hasMore, isLoading, error, scrollPosition } = useSelector(
    (state) => state.feed
  )
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

  useEffect(() => {
    if (error) {
      console.error('Error fetching posts:', error)
    }
  }, [error])

  // Fetch initial posts only if the list is empty
  useEffect(() => {
    if (posts.length === 0) {
      dispatch(fetchPosts())
    }
  }, [dispatch, posts.length])

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

  // Debounced scroll handler
  const handleScroll = useCallback(
    debounce((position) => {
      dispatch(setScrollPosition(position))
    }, 200),
    [dispatch]
  )

  const handleFetchMorePosts = () => {
    if (hasMore && !isLoading) {
      dispatch(fetchPosts())
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
        />
      </ComponentLoader>
    </div>
  )
}
