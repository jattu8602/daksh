'use client'

import StoryViewer from '../story-viewer'
import { useEffect, useState, useCallback } from 'react'

const LOCAL_STORIES_KEY = 'feed_stories_cache'
const STORIES_TIMESTAMP_KEY = 'feed_stories_timestamp'
const MEDIA_CACHE_KEY = 'story_media_cache'
const AVATAR_CACHE_KEY = 'mentor_avatar_cache'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes cache

// Media preloader with localStorage caching
class MediaPreloader {
  constructor() {
    this.cache = this.loadFromStorage()
    this.avatarCache = this.loadAvatarCache()
  }

  loadFromStorage() {
    try {
      return JSON.parse(localStorage.getItem(MEDIA_CACHE_KEY) || '{}')
    } catch {
      return {}
    }
  }

  loadAvatarCache() {
    try {
      return JSON.parse(localStorage.getItem(AVATAR_CACHE_KEY) || '{}')
    } catch {
      return {}
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(MEDIA_CACHE_KEY, JSON.stringify(this.cache))
      localStorage.setItem(AVATAR_CACHE_KEY, JSON.stringify(this.avatarCache))
    } catch (e) {
      console.warn('Failed to save media cache:', e)
    }
  }

  async preloadImage(url) {
    if (this.cache[url]) return this.cache[url]

    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch')

      const blob = await response.blob()
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.readAsDataURL(blob)
      })

      this.cache[url] = base64
      this.saveToStorage()
      return base64
    } catch (e) {
      console.warn('Failed to preload image:', url, e)
      return url // fallback to original URL
    }
  }

  async preloadAvatar(url) {
    if (this.avatarCache[url]) return this.avatarCache[url]

    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch')

      const blob = await response.blob()
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.readAsDataURL(blob)
      })

      this.avatarCache[url] = base64
      this.saveToStorage()
      return base64
    } catch (e) {
      console.warn('Failed to preload avatar:', url, e)
      return url // fallback to original URL
    }
  }

  preloadVideo(url) {
    return new Promise((resolve) => {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.crossOrigin = 'anonymous'
      video.src = url
      video.muted = true
      video.playsInline = true

      video.addEventListener('canplaythrough', () => resolve(url), {
        once: true,
      })
      video.addEventListener('error', () => resolve(url), { once: true })

      // Timeout fallback
      setTimeout(() => resolve(url), 3000)
    })
  }

  getCachedMedia(url) {
    return this.cache[url] || url
  }

  getCachedAvatar(url) {
    return this.avatarCache[url] || url
  }

  clearOldCache() {
    // Clear cache entries older than 7 days
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    Object.keys(this.cache).forEach((key) => {
      if (this.cache[key].timestamp && this.cache[key].timestamp < oneWeekAgo) {
        delete this.cache[key]
      }
    })
    this.saveToStorage()
  }
}

// Global instance
const mediaPreloader = new MediaPreloader()

// Check if stories cache is fresh (less than 5 minutes old)
function isCacheFresh() {
  try {
    const timestamp = localStorage.getItem(STORIES_TIMESTAMP_KEY)
    if (!timestamp) return false
    return Date.now() - parseInt(timestamp) < CACHE_DURATION
  } catch {
    return false
  }
}

// Save stories with timestamp
function saveStoriesWithTimestamp(stories) {
  try {
    localStorage.setItem(LOCAL_STORIES_KEY, JSON.stringify(stories))
    localStorage.setItem(STORIES_TIMESTAMP_KEY, Date.now().toString())
  } catch (e) {
    console.warn('Failed to save stories cache:', e)
  }
}

export default function Stories({ onStoryClick, activeModal, closeModal }) {
  // Helper to group highlights per mentor
  const groupByMentor = useCallback((items) => {
    const map = new Map()
    items.forEach((item) => {
      const key = item.mentorId || item.mentorUsername
      if (!map.has(key)) {
        map.set(key, {
          mentorId: key,
          mentorUsername: item.mentorUsername,
          mentorAvatar: item.mentorAvatar,
          stories: [],
        })
      }
      map.get(key).stories.push(item)
    })

    // Determine watched status per group (if all stories watched -> true)
    return Array.from(map.values()).map((g) => ({
      ...g,
      isWatched: g.stories.every((s) => s.isWatched),
    }))
  }, [])

  // Preload cached stories before first paint to avoid flicker
  const initialStories =
    typeof window !== 'undefined'
      ? (() => {
          try {
            return JSON.parse(localStorage.getItem(LOCAL_STORIES_KEY) || '[]')
          } catch {
            return []
          }
        })()
      : []

  const [stories, setStories] = useState(initialStories)
  const [groups, setGroups] = useState(() => groupByMentor(initialStories))
  const [viewerIndex, setViewerIndex] = useState(0)
  const [storyStart, setStoryStart] = useState(0)
  const [preloadedGroups, setPreloadedGroups] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Preload media for stories
  const preloadStoryMedia = useCallback(
    async (storiesData) => {
      if (!storiesData.length) return

      try {
        // Preload first 10 stories' media + all mentor avatars
        const preloadPromises = storiesData.slice(0, 10).map(async (story) => {
          const promises = []

          // Preload story media
          if (story.mediaType === 'video') {
            promises.push(mediaPreloader.preloadVideo(story.url))
          } else {
            promises.push(mediaPreloader.preloadImage(story.url))
          }

          // Preload mentor avatar
          if (story.mentorAvatar && story.mentorAvatar !== '/placeholder.svg') {
            promises.push(mediaPreloader.preloadAvatar(story.mentorAvatar))
          }

          return Promise.all(promises)
        })

        await Promise.allSettled(preloadPromises)

        // Update groups with preloaded media URLs
        const groupsWithPreloadedMedia = groupByMentor(storiesData).map(
          (group) => ({
            ...group,
            mentorAvatar: mediaPreloader.getCachedAvatar(group.mentorAvatar),
            stories: group.stories.map((story) => ({
              ...story,
              url:
                story.mediaType === 'video'
                  ? story.url
                  : mediaPreloader.getCachedMedia(story.url),
              mentorAvatar: mediaPreloader.getCachedAvatar(story.mentorAvatar),
            })),
          })
        )

        setPreloadedGroups(groupsWithPreloadedMedia)
      } catch (e) {
        console.warn('Media preloading failed:', e)
      }
    },
    [groupByMentor]
  )

  // Background fetch function with timeout
  const fetchStoriesInBackground = useCallback(async () => {
    if (isRefreshing) return // Prevent multiple concurrent requests

    setIsRefreshing(true)

    try {
      // Add timeout to the fetch request
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const response = await fetch('/api/stories?limit=15', {
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.data) {
        setStories(data.data)
        setGroups(groupByMentor(data.data))
        saveStoriesWithTimestamp(data.data)

        // Start preloading media in background
        preloadStoryMedia(data.data)
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('Stories API request timed out')
      } else {
        console.warn('Failed to fetch stories:', error)
      }
      // Don't show error to user, just use cached data
    } finally {
      setIsRefreshing(false)
    }
  }, [isRefreshing, groupByMentor, preloadStoryMedia])

  // Fetch stories with stale-while-revalidate pattern
  useEffect(() => {
    const shouldFetchFresh = !isCacheFresh()

    if (shouldFetchFresh) {
      // If cache is stale, fetch in background but don't block UI
      setTimeout(() => {
        fetchStoriesInBackground()
      }, 100) // Small delay to not block initial render
    } else if (initialStories.length > 0) {
      // If cache is fresh, start preloading media immediately
      preloadStoryMedia(initialStories)
    }
  }, [])

  // Keep groups in sync if stories change from other interactions
  useEffect(() => {
    setGroups(groupByMentor(stories))
  }, [stories, groupByMentor])

  // Clear old cache on mount
  useEffect(() => {
    mediaPreloader.clearOldCache()
  }, [])

  const handleStoryClick = useCallback(
    (story) => {
      const targetGroups = preloadedGroups.length ? preloadedGroups : groups
      const idx = targetGroups.findIndex(
        (g) =>
          (g.mentorId || g.mentorUsername) ===
          (story.mentorId || story.mentorUsername)
      )
      setViewerIndex(idx >= 0 ? idx : 0)
      setStoryStart(0)
      onStoryClick('story')
    },
    [preloadedGroups, groups, onStoryClick]
  )

  const displayGroups = preloadedGroups.length ? preloadedGroups : groups

  return (
    <div>
      {/* Stories */}
      <div className="pb-2">
        <div className="flex space-x-2 overflow-x-auto hide-scrollbar">
          {displayGroups.map((group) => (
            <div
              key={group.mentorId || group.mentorUsername}
              className="flex flex-col items-center first:ml-3 cursor-pointer"
              onClick={() => handleStoryClick(group)}
            >
              <div className="relative">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center ${
                    !group.isWatched
                      ? 'bg-gradient-to-tr from-yellow-500 to-pink-500 p-[3px]'
                      : 'p-[3px] opacity-50'
                  }`}
                >
                  <div className="bg-white dark:bg-black rounded-full p-[3px] w-full h-full flex items-center justify-center">
                    <img
                      src={group.mentorAvatar || '/placeholder.svg'}
                      alt={group.mentorUsername}
                      className="w-full h-full rounded-full object-cover"
                      loading="eager"
                    />
                  </div>
                </div>
                {/* Show subtle refresh indicator when updating in background */}
                {isRefreshing && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                )}
              </div>
              <span className="text-xs mt-1 truncate w-16 text-center">
                {group.mentorUsername}
              </span>
            </div>
          ))}
        </div>
      </div>
      {activeModal.type === 'story' && (
        <StoryViewer
          key={`${viewerIndex}-${storyStart}`}
          stories={displayGroups[viewerIndex]?.stories || []}
          startIndex={storyStart}
          onClose={closeModal}
          onComplete={() => {
            if (viewerIndex < displayGroups.length - 1) {
              setViewerIndex(viewerIndex + 1)
              setStoryStart(0)
            } else {
              closeModal()
            }
          }}
          onPrev={() => {
            if (viewerIndex > 0) {
              const newIdx = viewerIndex - 1
              setViewerIndex(newIdx)
              setStoryStart(displayGroups[newIdx].stories.length - 1)
            } else {
              closeModal()
            }
          }}
        />
      )}
    </div>
  )
}
