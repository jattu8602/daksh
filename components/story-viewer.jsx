'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Heart, Send, Play, Pause } from 'lucide-react'

export default function StoryViewer({
  stories = [],
  startIndex = 0,
  onClose,
  onComplete,
  onPrev,
}) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(startIndex)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const intervalRef = useRef(null)
  const preloadRef = useRef(new Set())

  const currentStory = stories[currentStoryIndex]

  // Preload adjacent stories for smoother transitions
  useEffect(() => {
    const preloadStory = (index) => {
      if (index < 0 || index >= stories.length || preloadRef.current.has(index))
        return

      const story = stories[index]
      if (!story?.url) return

      if (story.mediaType === 'video') {
        const video = document.createElement('video')
        video.preload = 'metadata'
        video.crossOrigin = 'anonymous'
        video.src = story.url
        video.muted = true
        video.playsInline = true
        video.addEventListener(
          'canplaythrough',
          () => {
            preloadRef.current.add(index)
          },
          { once: true }
        )
      } else {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = story.url
        img.onload = () => {
          preloadRef.current.add(index)
        }
      }
    }

    // Preload current, next, and previous stories
    preloadStory(currentStoryIndex - 1)
    preloadStory(currentStoryIndex)
    preloadStory(currentStoryIndex + 1)
  }, [currentStoryIndex, stories])

  // Auto-progress effect (~5s per story)
  useEffect(() => {
    if (isPaused || isLoading) return

    clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return prev
        const next = prev + 2
        if (next >= 100) {
          handleNext()
          return 0
        }
        return next
      })
    }, 100)

    return () => clearInterval(intervalRef.current)
  }, [currentStoryIndex, isPaused, isLoading])

  // Reset loading state when story changes
  useEffect(() => {
    setIsLoading(true)
    setHasError(false)
    setProgress(0)
  }, [currentStoryIndex])

  const handlePauseToggle = () => setIsPaused((p) => !p)

  const handleNext = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1)
      setProgress(0)
    } else {
      if (typeof onComplete === 'function') {
        onComplete()
      } else {
        onClose()
      }
    }
  }

  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1)
      setProgress(0)
    } else {
      if (typeof onPrev === 'function') {
        onPrev()
      } else {
        onClose()
      }
    }
  }

  const handleMediaLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleMediaError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  return (
    <div className="fixed inset-0 bg-black z-[100]">
      {/* Progress bars */}
      <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
        {stories.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{
                width:
                  index < currentStoryIndex
                    ? '100%'
                    : index === currentStoryIndex
                    ? `${progress}%`
                    : '0%',
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-12 left-4 right-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
              <img
                src={currentStory?.mentorAvatar || '/placeholder.svg'}
                alt={currentStory?.mentorUsername || ''}
                className="w-full h-full rounded-full object-cover"
                loading="eager"
              />
            </div>
            <span className="text-white font-medium">
              {currentStory?.mentorUsername || ''}
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handlePauseToggle}
          className="text-white hover:bg-white/20"
        >
          {isPaused ? (
            <Play className="w-5 h-5" />
          ) : (
            <Pause className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Story content */}
      <div
        className="w-full h-full flex items-center justify-center relative"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error state */}
        {hasError && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="text-white text-center">
              <div className="text-4xl mb-2">⚠️</div>
              <p>Failed to load story</p>
            </div>
          </div>
        )}

        {/* Media content */}
        {currentStory?.mediaType === 'video' ? (
          <video
            key={currentStory.id}
            src={currentStory.url}
            className="max-h-full max-w-full object-contain"
            autoPlay
            muted
            playsInline
            onLoadedData={handleMediaLoad}
            onError={handleMediaError}
            onCanPlay={handleMediaLoad}
          />
        ) : (
          <img
            key={currentStory.id}
            src={currentStory.url}
            alt="story"
            className="max-h-full max-w-full object-contain"
            onLoad={handleMediaLoad}
            onError={handleMediaError}
            loading="eager"
          />
        )}

        {/* Invisible overlay for previous/next zones */}
        <div className="absolute inset-0 flex">
          <div className="flex-1" onClick={handlePrevious} />
          <div className="flex-1" onClick={handleNext} />
        </div>
      </div>

      {/* Bottom actions */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
        <div className="flex-1 bg-white/20 rounded-full px-4 py-2">
          <input
            type="text"
            placeholder="Send message"
            className="w-full bg-transparent text-white placeholder-white/70 outline-none"
          />
        </div>
        <Button
          size="icon"
          className="bg-white/20 hover:bg-white/30 text-white"
        >
          <Heart className="w-5 h-5" />
        </Button>
        <Button
          size="icon"
          className="bg-white/20 hover:bg-white/30 text-white"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
