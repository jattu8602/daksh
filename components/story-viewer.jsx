'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Heart, Send, Play, Pause } from 'lucide-react'

export default function StoryViewer({
  stories = [],
  startIndex = 0,
  onClose,
  onComplete,
}) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(startIndex)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef(null)

  const currentStory = stories[currentStoryIndex]

  // Auto-progress effect (~5s per story)
  useEffect(() => {
    if (isPaused) return

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
  }, [currentStoryIndex, isPaused])

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
    }
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
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
        {currentStory?.mediaType === 'video' ? (
          <video
            key={currentStory.id}
            src={currentStory.url}
            className="max-h-full max-w-full object-contain"
            autoPlay
            muted
            playsInline
          />
        ) : (
          <img
            key={currentStory.id}
            src={currentStory.url}
            alt="story"
            className="max-h-full max-w-full object-contain"
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
