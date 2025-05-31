'use client'

import {
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  Send,
  Home,
  Search,
  PlusSquare,
  Play,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect, lazy, Suspense } from 'react'
import Image from 'next/image'
import {
  PageLoader,
  ComponentLoader,
  SkeletonCard,
  SkeletonText,
} from '@/components/ui/loading'
import { dummyPosts, followedUsersDummy } from './dummyDataFile'

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
  const [isLoading, setIsLoading] = useState(true)
  const [componentsLoaded, setComponentsLoaded] = useState({
    header: false,
    stories: false,
    posts: false,
  })

  // Stories data - simplified without interfaces
  const [stories, setStories] = useState([
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

  // Posts data - simplified without interfaces
  const [posts, setPosts] = useState([
    {
      id: '1',
      username: 'sachin.sir_history',
      avatar: '/placeholder.svg?height=40&width=40',
      image: '/images/books-image.png',
      caption: 'Books are the best friends',
      likes: 100,
      comments: 16,
      time: '30 minutes ago',
      hashtags: ['hardwork', 'studymotivation'],
    },
  ])

  const [likedPosts, setLikedPosts] = useState([])
  const [savedPosts, setSavedPosts] = useState([])

  const toggleLike = (postId) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter((id) => id !== postId))
    } else {
      setLikedPosts([...likedPosts, postId])
    }
  }

  const toggleSave = (postId) => {
    if (savedPosts.includes(postId)) {
      setSavedPosts(savedPosts.filter((id) => id !== postId))
    } else {
      setSavedPosts([...savedPosts, postId])
    }
  }

  // Simulate component loading with staggered timing
  useEffect(() => {
    const loadSequence = async () => {
      // Simulate initial loading
      await new Promise((resolve) => setTimeout(resolve, 300))
      setComponentsLoaded((prev) => ({ ...prev, header: true }))

      await new Promise((resolve) => setTimeout(resolve, 200))
      setComponentsLoaded((prev) => ({ ...prev, stories: true }))

      await new Promise((resolve) => setTimeout(resolve, 200))
      setComponentsLoaded((prev) => ({ ...prev, posts: true }))

      setIsLoading(false)
    }

    loadSequence()
  }, [])

  // Show full page loader initially
  if (isLoading && !componentsLoaded.header) {
    return <PageLoader message="Loading your feed..." />
  }

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-md mx-auto">
      <ComponentLoader
        isLoading={!componentsLoaded.header}
        skeleton={<SkeletonCard className="h-16 m-4" />}
      >
        <Suspense fallback={<SkeletonCard className="h-16 m-4" />}>
          <Header />
        </Suspense>
      </ComponentLoader>

      <ComponentLoader
        isLoading={!componentsLoaded.stories}
        skeleton={<StoriesSkeleton />}
      >
        <Suspense fallback={<StoriesSkeleton />}>
          <Stories stories={stories} likedPosts={likedPosts} />
        </Suspense>
      </ComponentLoader>

      <ComponentLoader
        isLoading={!componentsLoaded.posts}
        skeleton={<PostsSkeleton />}
      >
        <Suspense fallback={<PostsSkeleton />}>
          <Posts
            posts={dummyPosts}
            likedPosts={likedPosts}
            savedPosts={savedPosts}
            toggleLike={toggleLike}
            toggleSave={toggleSave}
            followedUsers={followedUsersDummy}
          />
        </Suspense>
      </ComponentLoader>
    </div>
  )
}
