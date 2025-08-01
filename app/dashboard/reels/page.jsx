'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Volume2,
  VolumeX,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

// --- START: localStorage Caching ---
const REELS_CACHE_KEY = 'daksh_reels_cache'
const MAX_CACHED_REELS = 5 // Keep up to 20 most recent reels in cache
const STACK_SIZE = 6 // Number of videos per stack

const getCachedReels = () => {
  if (typeof window === 'undefined') return []
  try {
    const cachedData = localStorage.getItem(REELS_CACHE_KEY)
    if (cachedData) {
      const reels = JSON.parse(cachedData)
      if (Array.isArray(reels)) {
        return reels
      }
    }
  } catch (error) {
    console.error('Error reading reels cache:', error)
    localStorage.removeItem(REELS_CACHE_KEY)
  }
  return []
}

const saveReelsToCache = (reels) => {
  if (typeof window === 'undefined') return
  try {
    const reelsToCache = reels.slice(-MAX_CACHED_REELS)
    localStorage.setItem(REELS_CACHE_KEY, JSON.stringify(reelsToCache))
  } catch (error) {
    console.error('Error saving reels to cache:', error)
  }
}
// --- END: localStorage Caching ---

const commentsData = [
  {
    id: 1,
    username: 'curious_student',
    avatar: '/placeholder.svg?height=32&width=32',
    text: 'This is so informative! Thanks for sharing 🙏',
    time: '2h',
    replies: [
      {
        id: 11,
        username: 'science_explorer',
        avatar: '/placeholder.svg?height=32&width=32',
        text: 'Glad you found it helpful! 😊',
        time: '1h',
      },
      {
        id: 12,
        username: 'learning_enthusiast',
        avatar: '/placeholder.svg?height=32&width=32',
        text: 'Same here! Love these educational videos',
        time: '45m',
      },
    ],
  },
  {
    id: 2,
    username: 'knowledge_seeker',
    avatar: '/placeholder.svg?height=32&width=32',
    text: 'Can you make more videos like this? 🔥',
    time: '4h',
    replies: [],
  },
  {
    id: 3,
    username: 'student_life',
    avatar: '/placeholder.svg?height=32&width=32',
    text: 'Amazing explanation! This helped me understand the concept better 📚',
    time: '6h',
    replies: [
      {
        id: 31,
        username: 'physics_mentor',
        avatar: '/placeholder.svg?height=32&width=32',
        text: "That's exactly what we aim for! Keep learning 🚀",
        time: '5h',
      },
    ],
  },
]

const shareUsers = [
  {
    username: 'best_friend',
    avatar: '/placeholder.svg?height=40&width=40',
    name: 'Sarah Johnson',
  },
  {
    username: 'study_buddy',
    avatar: '/placeholder.svg?height=40&width=40',
    name: 'Mike Chen',
  },
  {
    username: 'lab_partner',
    avatar: '/placeholder.svg?height=40&width=40',
    name: 'Emma Davis',
  },
  {
    username: 'class_mate',
    avatar: '/placeholder.svg?height=40&width=40',
    name: 'Alex Kumar',
  },
  {
    username: 'project_team',
    avatar: '/placeholder.svg?height=40&width=40',
    name: 'Lisa Wang',
  },
]

const ReelSkeleton = () => (
  <div className="fixed inset-0 animate-pulse bg-black">
    {/* Right side actions skeleton */}
    <div className="absolute bottom-24 right-3 z-10 flex flex-col items-center gap-5">
      <div className="flex flex-col items-center gap-2">
        <div className="h-9 w-9 rounded-full bg-zinc-800"></div>
        <div className="h-2 w-6 rounded-md bg-zinc-800"></div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="h-9 w-9 rounded-full bg-zinc-800"></div>
        <div className="h-2 w-6 rounded-md bg-zinc-800"></div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="h-9 w-9 rounded-full bg-zinc-800"></div>
        <div className="h-2 w-6 rounded-md bg-zinc-800"></div>
      </div>
      <div className="h-9 w-9 rounded-full bg-zinc-800"></div>
      <div className="h-9 w-9 rounded-full bg-zinc-800"></div>
    </div>
    {/* Bottom content skeleton */}
    <div className="absolute bottom-16 left-4 right-20 z-10">
      <div className="mb-3 flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-zinc-800"></div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-24 rounded-md bg-zinc-800"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-48 rounded-md bg-zinc-800"></div>
        <div className="h-3 w-32 rounded-md bg-zinc-800"></div>
      </div>
    </div>
  </div>
)

export default function InstagramReels() {
  const [currentReel, setCurrentReel] = useState(0)
  const [showComments, setShowComments] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [reels, setReels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [preloadedReels, setPreloadedReels] = useState([])
  const [isPreloading, setIsPreloading] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
  const [isHolding, setIsHolding] = useState(false)
  const [lastTapTime, setLastTapTime] = useState(0)
  const [showDoubleTapHeart, setShowDoubleTapHeart] = useState(false)
  const [windowHeight, setWindowHeight] = useState(0)
  const [videoErrors, setVideoErrors] = useState({})
  const [loadedStacks, setLoadedStacks] = useState(new Set([0])) // Track which stacks have been loaded
  const [loadingStacks, setLoadingStacks] = useState(new Set()) // Track which stacks are currently loading

  const videoRefs = useRef([])
  const containerRef = useRef(null)
  const holdTimeoutRef = useRef(null)
  const preloadCache = useRef(new Set())
  const isInitialLoad = useRef(true)

  const reelsRef = useRef(reels)
  reelsRef.current = reels

  // Motion values for smooth scrolling
  const y = useMotionValue(0)
  const isDragging = useRef(false)

  // Stack helper functions
  const getCurrentStack = (reelIndex) => Math.floor(reelIndex / STACK_SIZE)
  const getStackStartIndex = (stackNumber) => stackNumber * STACK_SIZE
  const isFirstVideoOfStack = (reelIndex) => reelIndex % STACK_SIZE === 0

  // --- START: Cache reels whenever the list is updated ---
  useEffect(() => {
    if (reels.length > 0) {
      saveReelsToCache(reels)
    }
  }, [reels])
  // --- END: Cache reels whenever the list is updated ---

  // Aggressive preloading function
  const preloadVideos = useCallback((reelsList) => {
    reelsList.forEach((reel, index) => {
      if (!preloadCache.current.has(reel.id) && index < 2) {
        // Preload first 5 videos
        const video = document.createElement('video')
        video.preload = 'metadata'
        video.crossOrigin = 'anonymous'
        video.src = reel.videoUrl
        video.muted = true
        video.playsInline = true

        video.addEventListener('loadedmetadata', () => {
          preloadCache.current.add(reel.id)
        })

        video.addEventListener('canplaythrough', () => {
          preloadCache.current.add(reel.id + '_ready')
        })
      }
    })
  }, [])

  // Load a specific stack of videos
  const loadStack = useCallback(
    async (stackNumber) => {
      if (loadedStacks.has(stackNumber) || loadingStacks.has(stackNumber)) {
        return // Stack already loaded or loading
      }

      console.log(
        `Loading stack ${stackNumber} (videos ${getStackStartIndex(stackNumber)} to ${getStackStartIndex(stackNumber) + STACK_SIZE - 1})`
      )

      setLoadingStacks((prev) => new Set(prev).add(stackNumber))

      try {
        const response = await fetch(
          `/api/reels/shots?limit=${STACK_SIZE}&t=${Date.now()}`
        )
        const data = await response.json()

        if (data.success && data.data.length > 0) {
          const newReels = data.data.filter(
            (newReel) =>
              !reels.some((existingReel) => existingReel.id === newReel.id)
          )

          if (newReels.length > 0) {
            setReels((prev) => [...prev, ...newReels])
            setLoadedStacks((prev) => new Set(prev).add(stackNumber))
            preloadVideos(newReels)
            console.log(
              `Successfully loaded stack ${stackNumber} with ${newReels.length} videos`
            )
          }
        }
      } catch (err) {
        console.error(`Error loading stack ${stackNumber}:`, err)
      } finally {
        setLoadingStacks((prev) => {
          const newSet = new Set(prev)
          newSet.delete(stackNumber)
          return newSet
        })
      }
    },
    [reels, loadedStacks, loadingStacks, preloadVideos]
  )

  // Fetch mentor shots from API with better error handling
  const fetchMentorShots = useCallback(
    async (limit = 3, isRefresh = false) => {
      try {
        if (!isRefresh && reelsRef.current.length === 0) setLoading(true)
        setError(null)

        console.log('Fetching mentor shots:', { limit, isRefresh })

        const response = await fetch(
          `/api/reels/shots?limit=${limit}&t=${Date.now()}`
        )
        const data = await response.json()

        console.log('API Response:', {
          success: data.success,
          dataLength: data.data?.length,
          total: data.total,
          error: data.error,
        })

        if (data.success && data.data.length > 0) {
          const newReels = data.data

          console.log(
            'Video URLs:',
            newReels.map((reel) => ({
              id: reel.id,
              url: reel.videoUrl,
              mentor: reel.mentor.username,
            }))
          )

          if (isRefresh) {
            setReels(newReels)
            setCurrentReel(0)
            // Reset stack tracking for refresh
            setLoadedStacks(new Set([0]))
            setLoadingStacks(new Set())
          } else {
            setReels((prev) => {
              const combined = [...prev, ...newReels]
              // Remove duplicates, keeping the one from newReels if any
              const uniqueReels = combined.filter(
                (v, i, a) => a.findIndex((t) => t.id === v.id) === i
              )
              return uniqueReels
            })
          }

          // Mark first stack as loaded for initial load
          if (!isRefresh && reelsRef.current.length === 0) {
            setLoadedStacks(new Set([0]))
          }

          // Preload videos immediately
          preloadVideos(newReels)

          isInitialLoad.current = false
          setError(null)
        } else {
          setError(data.message || 'No mentor shots available')
          setReels([])
        }
      } catch (err) {
        console.error('Error fetching mentor shots:', err)
        setError('Failed to load mentor shots. Please check your connection.')
        setReels([])
      } finally {
        setLoading(false)
        setIsPreloading(false)
      }
    },
    [preloadVideos]
  )

  // Load more reels when needed
  const loadMoreReels = useCallback(async () => {
    if (isPreloading) return

    setIsPreloading(true)
    try {
      const response = await fetch(`/api/reels/shots?limit=6&t=${Date.now()}`)
      const data = await response.json()

      if (data.success && data.data.length > 0) {
        const newReels = data.data.filter(
          (newReel) =>
            !reels.some((existingReel) => existingReel.id === newReel.id)
        )

        if (newReels.length > 0) {
          setReels((prev) => [...prev, ...newReels])
          preloadVideos(newReels)
        }
      }
    } catch (err) {
      console.error('Error loading more reels:', err)
    } finally {
      setIsPreloading(false)
    }
  }, [reels, isPreloading, preloadVideos])

  // Refresh reels with new random content
  const refreshReels = useCallback(() => {
    isInitialLoad.current = true
    preloadCache.current.clear()
    setLoadedStacks(new Set([0]))
    setLoadingStacks(new Set())
    setReels([])
    fetchMentorShots(3, true).then(() => {
      setCurrentReel(0)
      setLoading(false)
    })
  }, [fetchMentorShots])

  // Initialize window height on client side
  useEffect(() => {
    setWindowHeight(window.innerHeight)

    const handleResize = () => {
      setWindowHeight(window.innerHeight)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Fetch initial reels on component mount - start immediately
  useEffect(() => {
    console.log('Initializing reels page...')
    const cachedReels = getCachedReels()
    console.log('Cached reels found:', cachedReels.length)

    if (cachedReels.length > 0) {
      console.log('Loading reels from cache:', cachedReels.length)
      setReels(cachedReels)
      setLoading(false)

      // Mark appropriate stacks as loaded based on cached reels
      const stacksFromCache = Math.ceil(cachedReels.length / STACK_SIZE)
      const stackNumbers = Array.from({ length: stacksFromCache }, (_, i) => i)
      setLoadedStacks(new Set(stackNumbers))
      console.log('Marked stacks as loaded from cache:', stackNumbers)
    } else {
      // No cache available or first time visit - fetch from API
      console.log(
        'No cache available or first time visit, fetching reels from API...'
      )
      fetchMentorShots(3, false)
        .then(() => {
          console.log('Initial API fetch completed')
          setLoading(false)
        })
        .catch((error) => {
          console.error('Error in initial API fetch:', error)
          setLoading(false)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Note: Removed old loadMoreReels useEffect - now using smart stack loading system

  // Preload videos when currentReel changes
  useEffect(() => {
    if (reels.length > 0) {
      const startIndex = Math.max(0, currentReel - 1)
      const endIndex = Math.min(reels.length - 1, currentReel + 3)
      const reelsToPreload = reels.slice(startIndex, endIndex + 1)
      preloadVideos(reelsToPreload)
    }
  }, [currentReel, reels, preloadVideos])

  // Smart stack loading based on current video position
  useEffect(() => {
    if (reels.length === 0) return

    const currentStack = getCurrentStack(currentReel)
    const nextStack = currentStack + 1

    // If we're at the first video of a stack, start loading the next stack
    if (isFirstVideoOfStack(currentReel)) {
      console.log(
        `User reached first video of stack ${currentStack}, loading next stack ${nextStack}`
      )
      loadStack(nextStack)
    }

    // Also load next stack if we're approaching the end of current stack
    const videosRemainingInStack = STACK_SIZE - (currentReel % STACK_SIZE)
    if (videosRemainingInStack <= 2) {
      // When 2 or fewer videos left in current stack
      console.log(
        `Approaching end of stack ${currentStack} (${videosRemainingInStack} videos left), loading next stack ${nextStack}`
      )
      loadStack(nextStack)
    }
  }, [currentReel, reels.length, loadStack])

  const toggleLike = () => {
    setReels((prev) =>
      prev.map((reel, index) =>
        index === currentReel
          ? {
              ...reel,
              isLiked: !reel.isLiked,
              likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1,
            }
          : reel
      )
    )
  }

  const formatCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  const truncateText = (text, maxLength = 30) =>
    text.length <= maxLength ? text : text.substring(0, maxLength) + '...'

  const handleAddComment = () => {
    if (!newComment.trim()) return
    setNewComment('')
    setReplyingTo(null)
  }

  const handleVideoTap = (e) => {
    e.preventDefault()
    if (isDragging.current) return

    const currentTime = new Date().getTime()
    const tapLength = currentTime - lastTapTime

    if (tapLength < 300 && tapLength > 0) {
      // Double tap detected
      toggleLike()
      setShowDoubleTapHeart(true)
      setTimeout(() => setShowDoubleTapHeart(false), 1000)
    }

    setLastTapTime(currentTime)
  }

  const handleMouseDown = () => {
    holdTimeoutRef.current = setTimeout(() => {
      setIsHolding(true)
      const currentVideo = videoRefs.current[currentReel]
      if (currentVideo) {
        currentVideo.pause()
      }
    }, 200)
  }

  const handleMouseUp = () => {
    clearTimeout(holdTimeoutRef.current)
    if (isHolding) {
      setIsHolding(false)
      const currentVideo = videoRefs.current[currentReel]
      if (currentVideo) {
        currentVideo
          .play()
          .catch((err) => err.name !== 'AbortError' && console.warn(err))
      }
    }
  }

  const snapToReel = (targetReel) => {
    if (typeof window === 'undefined') return

    const targetY = -targetReel * windowHeight
    animate(y, targetY, {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      onComplete: () => {
        setCurrentReel(targetReel)
      },
    })
  }

  const handleDragEnd = (event, info) => {
    isDragging.current = false
    const threshold = 100
    const velocity = info.velocity.y
    const offset = info.offset.y

    let targetReel = currentReel

    // Determine target reel based on drag distance and velocity
    if (Math.abs(offset) > threshold || Math.abs(velocity) > 500) {
      if (offset > 0 && currentReel > 0) {
        targetReel = currentReel - 1
      } else if (offset < 0 && currentReel < reels.length - 1) {
        targetReel = currentReel + 1
      }
    }

    snapToReel(targetReel)
  }

  const handleWheel = (e) => {
    e.preventDefault()
    if (isDragging.current) return

    if (e.deltaY > 0 && currentReel < reels.length - 1) {
      snapToReel(currentReel + 1)
    } else if (e.deltaY < 0 && currentReel > 0) {
      snapToReel(currentReel - 1)
    }
  }

  useEffect(() => {
    const video = videoRefs.current[currentReel]
    if (video) {
      video.muted = isMuted
    }
  }, [isMuted])

  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (video) {
        if (idx === currentReel) {
          if (video.paused) {
            video.currentTime = 0
            video
              .play()
              .catch((err) => err.name !== 'AbortError' && console.warn(err))
          }
        } else {
          video.pause()
        }
      }
    })
  }, [currentReel, reels])

  // Initialize y position
  useEffect(() => {
    if (typeof window === 'undefined') return
    y.set(-currentReel * windowHeight)
  }, [currentReel, windowHeight])

  // Add useEffect to prevent pull-to-reload
  useEffect(() => {
    if (typeof window === 'undefined') return

    const preventPullToReload = (e) => {
      if (window.scrollY === 0 && e.touches[0].clientY > 0) {
        e.preventDefault()
      }
    }

    document.addEventListener('touchmove', preventPullToReload, {
      passive: false,
    })
    document.body.style.overscrollBehavior = 'none'

    return () => {
      document.removeEventListener('touchmove', preventPullToReload)
      document.body.style.overscrollBehavior = ''
    }
  }, [])

  // Loading state
  if (loading && reels.length === 0) {
    return (
      <div className="fixed inset-0 bg-black">
        <ReelSkeleton />
       
      </div>
    )
  }

  // Error state with retry
  if (error && reels.length === 0) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center px-6">
          <div className="text-6xl">🎥</div>
          <h3 className="text-white text-lg font-semibold">
            No Mentor Shots Found
          </h3>
          <p className="text-gray-400 text-sm max-w-sm">{error}</p>
          <div className="flex gap-3 mt-4">
            <Button
              onClick={() => {
                setError(null)
                setLoading(true)
                fetchMentorShots(3, false)
                  .then(() => {
                    setLoading(false)
                  })
                  .catch((err) => {
                    console.error('Retry failed:', err)
                    setLoading(false)
                  })
              }}
              className="flex items-center gap-2"
              variant="outline"
              disabled={loading}
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
              />
              {loading ? 'Loading...' : 'Try Again'}
            </Button>
          </div>
          <p className="text-gray-500 text-xs mt-2">
            Make sure mentor shots are available in your database
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 bg-black overscroll-none mb-7"
      style={{ overscrollBehavior: 'none' }}
    >
      {/* Refresh button */}
      <div className="absolute top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshReels}
          className="bg-black/20 backdrop-blur-sm text-white hover:bg-black/40"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Stack debug info (development mode) */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 z-50 text-white/70 text-xs bg-black/20 backdrop-blur-sm px-2 py-1 rounded">
          <div>
            Video: {currentReel + 1}/{reels.length}
          </div>
          <div>Stack: {getCurrentStack(currentReel) + 1}</div>
          <div>Loaded: {Array.from(loadedStacks).join(', ')}</div>
          {loadingStacks.size > 0 && (
            <div>Loading: {Array.from(loadingStacks).join(', ')}</div>
          )}
        </div>
      )} */}

      <div
        ref={containerRef}
        className="h-full w-full overflow-hidden overscroll-none"
        style={{ overscrollBehavior: 'none' }}
        onWheel={handleWheel}
      >
        <motion.div
          className="h-full"
          style={{ y }}
          drag="y"
          dragConstraints={{
            top: -(reels.length - 1) * windowHeight,
            bottom: 0,
          }}
          dragElastic={0.1}
          onDragStart={() => {
            isDragging.current = true
          }}
          onDragEnd={handleDragEnd}
          dragMomentum={false}
        >
          {reels.map((reel, idx) => (
            <motion.div
              key={reel.id}
              className="h-screen w-full relative"
              style={{ height: '100vh' }}
            >
              <video
                ref={(el) => (videoRefs.current[idx] = el)}
                className="w-full h-full py-12 object-fit"
                src={reel.videoUrl}
                loop
                muted={isMuted}
                playsInline
                preload="metadata"
                controls={videoErrors[reel.id] ? true : false}
                onClick={handleVideoTap}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onContextMenu={(e) => e.preventDefault()}
                onError={(e) => {
                  console.error(
                    'Video error for reel:',
                    reel.id,
                    reel.videoUrl,
                    e.target.error
                  )
                  console.error('Error details:', {
                    code: e.target.error?.code,
                    message: e.target.error?.message,
                    networkState: e.target.networkState,
                    readyState: e.target.readyState,
                  })
                  setVideoErrors((prev) => ({ ...prev, [reel.id]: true }))
                }}
                onLoadStart={(e) => {
                  console.log(
                    'Video load start for reel:',
                    reel.id,
                    reel.videoUrl
                  )
                  setVideoErrors((prev) => ({ ...prev, [reel.id]: false }))
                }}
                onCanPlay={(e) => {
                  console.log('Video can play for reel:', reel.id)
                  setVideoErrors((prev) => ({ ...prev, [reel.id]: false }))
                }}
                onLoadedData={(e) => {
                  console.log('Video loaded data for reel:', reel.id)
                }}
                onLoadedMetadata={(e) => {
                  console.log('Video loaded metadata for reel:', reel.id)
                }}
              />

              {/* Video Error Fallback */}
              {videoErrors[reel.id] && (
                <div className="absolute inset-0 bg-black flex flex-col items-center justify-center">
                  <div className="text-center text-white p-6">
                    <div className="text-6xl mb-4">🎥</div>
                    <h3 className="text-lg font-semibold mb-2">
                      Video Loading Error
                    </h3>
                    <p className="text-sm text-gray-300 mb-4">
                      Failed to load video content
                    </p>
                    <p className="text-xs text-gray-400 mb-4">
                      URL: {reel.videoUrl}
                    </p>
                    <button
                      onClick={() => {
                        // Retry loading the video
                        const video = videoRefs.current[idx]
                        if (video) {
                          setVideoErrors((prev) => ({
                            ...prev,
                            [reel.id]: false,
                          }))
                          video.load()
                        }
                      }}
                      className="bg-white/20 text-white px-4 py-2 rounded-lg text-sm hover:bg-white/30 transition-colors"
                    >
                      Retry Loading
                    </button>
                  </div>
                </div>
              )}

              {/* Double tap heart animation */}
              {showDoubleTapHeart && idx === currentReel && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                >
                  <Heart className="w-32 h-32 text-red-500 fill-red-500" />
                </motion.div>
              )}

              {/* Mute indicator */}
              <div className="absolute top-4 right-4">
                <div
                  className="bg-black/20 backdrop-blur-sm rounded-full p-2 cursor-pointer"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-white" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>

              {/* Loading indicator for stack loading */}
              {loadingStacks.size > 0 && idx === reels.length - 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-black/20 backdrop-blur-sm rounded-full p-2">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  </div>
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-white/70 text-xs">
                    Loading stack {Math.max(...loadingStacks)}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
                {/* Like */}
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    className="!w-9 !h-9 text-white hover:text-red-500 transition-colors p-0"
                    onClick={toggleLike}
                  >
                    <Heart
                      className={`!w-7 !h-7 ${
                        reel.isLiked ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                  </Button>
                  <span className="text-sm font-medium text-slate-200">
                    {formatCount(reel.likes)}
                  </span>
                </div>

                {/* Comment */}
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    className="!w-9 !h-9 text-white hover:text-blue-400 transition-colors p-0"
                    onClick={() => setShowComments(true)}
                  >
                    <MessageCircle className="!w-7 !h-7" />
                  </Button>
                  <span className="text-sm font-medium text-slate-200">
                    {reel.comments}
                  </span>
                </div>

                {/* Share */}
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    className="!w-9 !h-9 text-white hover:text-green-400 transition-colors p-0"
                    onClick={() => setShowShare(true)}
                  >
                    <Send className="!w-7 !h-7" />
                  </Button>
                  <span className="text-sm font-medium text-slate-200">
                    {formatCount(reel.shares)}
                  </span>
                </div>

                {/* Bookmark */}
                <div className="flex flex-col items-center">
                  <Button
                    variant="ghost"
                    className="!w-9 !h-9 text-white hover:text-yellow-400 transition-colors p-0"
                  >
                    <Bookmark className="!w-7 !h-7" />
                  </Button>
                </div>

                {/* More */}
                <Button
                  variant="ghost"
                  className="!w-9 !h-9 text-white hover:text-gray-400 transition-colors p-0"
                >
                  <MoreHorizontal className="!w-7 !h-7" />
                </Button>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-16 left-4 right-20">
                {/* Mentor Info */}
                <div className="flex items-center gap-3 mb-3 relative">
                  <Avatar className="w-12 h-12 border-2 border-white">
                    <AvatarImage
                      src={reel.mentor.avatar || '/icons/girl.png'}
                    />
                    <AvatarFallback>
                      {reel.mentor.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-3 bottom-0 left-14 absolute">
                    <div className="flex items-center gap-2 ">
                      <span className="font-semibold text-sm text-slate-200">
                        {reel.mentor.username}
                      </span>
                      {reel.mentor.isDaksh && (
                        <Badge className="bg-[#F66B7A] hover:bg-orange-500 text-white text-xs py-1 cursor-default">
                          daksh
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-sm px-2 py-1 h-8 border-2 border-white text-black hover:bg-black hover:text-black font-semibold"
                    >
                      Follow
                    </Button>
                  </div>
                </div>

                {/* Description */}
                <div className="text-xs text-slate-200 leading-tight">
                  <p>
                    {showFullDescription
                      ? reel.description
                      : truncateText(reel.description, 30)}{' '}
                    {reel.description.length > 30 && (
                      <button
                        className="text-blue-200 ml-1 font-medium text-xs"
                        onClick={() =>
                          setShowFullDescription(!showFullDescription)
                        }
                      >
                        {showFullDescription ? 'less' : 'more'}
                      </button>
                    )}
                  </p>
                  {/* Hashtags */}
                  {reel.hashtags && reel.hashtags.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {reel.hashtags.slice(0, 3).map((hashtag, index) => (
                        <span key={index} className="text-blue-300 text-xs">
                          #{hashtag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Comments Modal */}
      <Dialog open={showComments} onOpenChange={setShowComments}>
        <DialogContent className="max-w-sm mx-auto h-[80vh] p-0 bg-white text-black">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {commentsData.map((comment) => (
                <div key={comment.id} className="space-y-2">
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={comment.avatar || '/placeholder.svg'} />
                      <AvatarFallback>
                        {comment.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">
                          {comment.username}
                        </span>
                        <span className="text-xs text-gray-500">
                          {comment.time}
                        </span>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-gray-500 p-0 h-auto"
                        onClick={() => setReplyingTo(comment.id)}
                      >
                        Reply
                      </Button>
                    </div>
                  </div>
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3 ml-8">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={reply.avatar || '/placeholder.svg'} />
                        <AvatarFallback>
                          {reply.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-xs">
                            {reply.username}
                          </span>
                          <span className="text-xs text-gray-500">
                            {reply.time}
                          </span>
                        </div>
                        <p className="text-xs">{reply.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Input
                  placeholder={
                    replyingTo ? 'Add a reply...' : 'Add a comment...'
                  }
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="border-0 bg-gray-100 text-sm"
                />
                {replyingTo && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-gray-500 p-0 h-auto mt-1"
                    onClick={() => setReplyingTo(null)}
                  >
                    Cancel reply
                  </Button>
                )}
              </div>
              <Button size="sm" onClick={handleAddComment}>
                Post
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Modal */}
      <Dialog open={showShare} onOpenChange={setShowShare}>
        <DialogContent className="max-w-sm mx-auto bg-white text-black">
          <DialogHeader>
            <DialogTitle>Share</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {shareUsers.map((user) => (
              <div
                key={user.username}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatar || '/placeholder.svg'} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">@{user.username}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Send
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
